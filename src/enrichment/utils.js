import fs from 'fs';
import { resolve } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { extract, subset, module, filter, query, exclude } from '../utils/robot.js';
import { mergeTurtles } from '../utils/owl-cli.js';
import { redundant } from '../utils/relation-graph.js';
import { throwOnError } from '../utils/sh-exec.js';
import { info, error, more } from '../utils/logging.js';
import { ancestors } from '../utils/oaktool.js';
const execPromise = promisify(exec);

export function convertNormalizedMetadataToRdf(context, inputPath, outputPath, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}-metadata.yaml`);
  const errorPath = resolve(obj.path, 'enriched/metadata-enrichment-errors.yaml');

  linkmlConvert(context, inputPath, outputPath, schemaPath);
}

export function convertNormalizedMetadataToJson(context, inputPath, outputPath, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}-metadata.yaml`);
  linkmlConvert(context, inputPath, outputPath, schemaPath);

  const convertedData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const data = {
    $schema: `${context.cdnIri}schema/${overrideType || obj.type}-metadata/latest/assets/schema.json`,
    '@context': `${context.cdnIri}schema/${overrideType || obj.type}-metadata/latest/assets/schema.context.jsonld`,
    '@type': convertedData['@type'],
    iri: convertedData['iri'],
    ...convertedData,
  };

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}

export function convertNormalizedDataToRdf(context, inputPath, outputPath, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}.yaml`);
  linkmlConvert(context, inputPath, outputPath, schemaPath);
}

export function convertNormalizedDataToJson(context, inputPath, outputPath, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}.yaml`);
  linkmlConvert(context, inputPath, outputPath, schemaPath);

  const convertedData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const data = {
    $schema: `${context.cdnIri}schema/${overrideType || obj.type}/latest/assets/schema.json`,
    '@context': `${context.cdnIri}schema/${overrideType || obj.type}/latest/assets/schema.context.jsonld`,
    '@type': convertedData['@type'],
    iri: convertedData['iri'],
    ...convertedData,
  };

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}

function linkmlConvert(context, inputPath, outputPath, schemaPath) {
  const { skipValidation } = context;

  info(`Using 'linkml-convert' to transform ${inputPath}`);
  throwOnError(
    `linkml-convert ${skipValidation ? '--no-validate' : ''} --schema ${schemaPath} ${inputPath} -o ${outputPath}`,
    'Enrichment failed.'
  );
  info(`Enriched digital object written to ${outputPath}`);
}

export function prettifyEnriched(context) {
  const { selectedDigitalObject: obj, processorHome } = context;
  const enriched = resolve(obj.path, 'enriched/enriched.ttl');
  const prefixes = resolve(processorHome, 'schemas/prefixes.json');
  mergeTurtles(enriched, prefixes, [enriched]);
}

export function convertNormalizedDataToOwl(context, inputPath, outputPath, overrideType) {
  const command = getConversionCommand(context, inputPath, outputPath, overrideType);
  throwOnError(command, 'OWL conversion failed.',
   (message) => message.replace(/(.*\n)+TypeError:(.*)/, '$2').trim()
  );
  info(`Successfully transformed to OWL format at ${outputPath}`);
}

export async function convertAsyncNormalizedDataToOwl(context, inputPath, outputPath, overrideType, callback) {
  try {
    const command = getConversionCommand(context, inputPath, outputPath, overrideType);
    await execPromise(command);
    info(`Successfully transformed to OWL format at ${outputPath}`);
    callback(null);
  } 
  catch (err) {
    const errorMessage = `OWL conversion failed. ${err.message || "Unknown error occurred."}`;
    const errorStack = err.stack ? `\nStack trace:\n${err.stack}` : "";
    error(`${errorMessage}${errorStack}`);
    callback(err);
  }
}

function getConversionCommand(context, inputPath, outputPath, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;
  const schemaName = overrideType || obj.type;
  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${schemaName}.yaml`);
  const schemaBackupPath = resolve(processorHome, 'schemas/generated/linkml', `${schemaName}.yaml.bak`);
  
  info(`Using 'linkml-data2owl' to transform ${inputPath} to OWL format using the '${schemaName}' schema`);
  
  // Step 1: Substitute the "id" in the schema file with the digital object's IRI
  const sedCommand = `sed -i.bak 's|^id:.*|id: ${obj.iri}|' ${schemaPath}`;

  // Step 2: Transform the normalized data from YAML to OWL using linkml-data2owl
  const linkmlCommand = `linkml-data2owl --output-type ttl --schema ${schemaPath} ${inputPath} -o ${outputPath}`;

  // Step 3: Restore the original schema file to its original state
  const restoreCommand = `mv ${schemaBackupPath} ${schemaPath} 2>/dev/null`;

  // Combine all commands into a single shell script to be executed sequentially
  return `${sedCommand} && ${linkmlCommand} && ${restoreCommand}`;
}

export function isFileEmpty(path) {
  return fs.statSync(path).size === 0;
}

export function collectEntities(context, ontologyName, inputPath, useOboId = false) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const queryPath = resolve(processorHome, `src/utils/get-${ontologyName}-terms.sparql`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-terms.csv`);

  query(inputPath, queryPath, outputPath);
  if (useOboId) {
    throwOnError(
      `sed -i.bak -r 's|^http://purl.obolibrary.org/obo/([A-Z]+)_([0-9]+)|\\1:\\2|g' ${outputPath}`,
      'Convert to OBO ID failed.'
    );
  }
  throwOnError(`sed -i.bak '1d' ${outputPath}`, 'Collect entities failed.');

  return outputPath;
}

export function filterClasses(context, ontologyName, classTermFile) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-filter.owl`);

  filter(
    ontologyPath,
    classTermFile,
    ['rdfs:label', 'http://www.geneontology.org/formats/oboInOwl#id', 'http://purl.obolibrary.org/obo/IAO_0000115'],
    outputPath
  );

  return outputPath;
}

export function extractClassHierarchy(context, ontologyName, upperTerm, lowerTerms, intermediates = 'all') {
  const { selectedDigitalObject: obj, processorHome } = context;

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-extract.owl`);

  extract(ontologyPath, upperTerm, lowerTerms, outputPath, intermediates);

  return outputPath;
}

export function extractOntologySubset(context, ontologyName, inputPath, predicates) {
  info('Extracting a subset of UBERON ontology.');

  const seedTerms = collectEntities(context, ontologyName, inputPath, true);
  if (isFileEmpty(seedTerms)) {
    return null;
  }

  const { selectedDigitalObject: obj, processorHome } = context;
  const ontologyDbPath = resolve(processorHome, `mirrors/${ontologyName}.db`);
  const ancestorTerms = resolve(obj.path, `enriched/ancestor-terms.csv`);
  ancestors('sqlite:', ontologyDbPath, seedTerms, predicates, ancestorTerms);

  const subsetSeedTerms = resolve(obj.path, `enriched/subset-terms.csv`);
  generateSubsetSeedTerms(predicates, ancestorTerms, subsetSeedTerms);

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-subset.owl`);
  subset(ontologyPath, subsetSeedTerms, outputPath);

  return outputPath;
}

function generateSubsetSeedTerms(predicates, inputPath, outputPath) {
  throwOnError(
    `awk -F'\t' 'NR > 1 {print $1} END {print "${predicates.join('\\n')}"}' ${inputPath} > ${outputPath}`,
    'Collect subset entities failed.'
  );
}

export function extractOntologyModule(context, ontologyName, seedTerms) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-extract.owl`);

  module(ontologyPath, seedTerms, outputPath);

  return outputPath;
}

export function excludeTerms(context, inputPath, outputPath) {
  const { processorHome } = context;

  const excludeTermsPath = resolve(processorHome, 'src/enrichment/exclude-terms.txt');
  exclude(inputPath, excludeTermsPath, outputPath);
}

export function runCompleteClosure(inputPath, outputPath) {
  redundant(inputPath, outputPath);
}

export function cleanTemporaryFiles(context) {
  const { selectedDigitalObject: obj } = context;
  const enrichedPath = resolve(obj.path, 'enriched/');
  throwOnError(
    `find ${enrichedPath} ! -name 'enriched.json' ! -name 'enriched.ttl' ! -name 'enriched-metadata.json' ! -name 'enriched-metadata.ttl' ! -name 'redundant.ttl' -type f -exec rm -f {} +`,
    'Clean temporary files failed.'
  );
}

export function cleanDirectory(context) {
  const { selectedDigitalObject: obj } = context;
  const path = resolve(obj.path, 'enriched/');
  throwOnError(`find ${path} -type f -exec rm -f {} +`, 'Clean enriched directory failed.');
}

export function logOutput(outputPath) {
  more(`==> ${outputPath}`);
}

export function push(arr, item) {
  if (item) {
    arr.push(item);
  }
}
