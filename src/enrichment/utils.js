import fs from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { convert, extract, filter, merge, query, exclude } from '../utils/robot.js';
import { mergeTurtles } from '../utils/owl-cli.js';
import { redundant } from '../utils/relation-graph.js';
import { throwOnError } from '../utils/sh-exec.js';
import { info, more } from '../utils/logging.js';

export function convertNormalizedMetadataToRdf(context, inputPath, outputPath, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}-metadata.yaml`);
  const errorPath = resolve(obj.path, 'enriched/metadata-enrichment-errors.yaml');

  convertNormalizedToRdf(context, inputPath, outputPath, schemaPath);
}

export function convertNormalizedDataToRdf(context, inputPath, outputPath, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}.yaml`);
  const errorPath = resolve(obj.path, 'enriched/data-enrichment-errors.yaml');

  convertNormalizedToRdf(context, inputPath, outputPath, schemaPath);
}

function convertNormalizedToRdf(context, inputPath, outputPath, schemaPath, objectIri) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schemaBackupPath = resolve(processorHome, 'schemas/generated/linkml', `schema.yaml.bak`);
  sh.cp(schemaPath, schemaBackupPath);

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
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}.yaml`);
  const schemaBackupPath = resolve(processorHome, 'schemas/generated/linkml', `${overrideType || obj.type}.yaml.bak`);

  info(`Using 'linkml-data2owl' to transform ${inputPath}`);
  /*
   * The steps:
   *  1. Substitute the "id" parameter in the schema file (LinkML) with the digital object's IRI,
   *     ensuring that the resulting OWL ontology uses the digital object IRI as its ontology IRI.
   *  2. Employ the linkml-data2owl tool to transform the normalized digital object from YAML into
   *     OWL format.
   *  3. Restore the original schema file to its initial state, thereby reinstating the original
   *     "id" parameter.
   */
  throwOnError(
    `sed -i.bak 's|^id:.*|id: ${obj.iri}|' ${schemaPath} && \
     linkml-data2owl --output-type ttl --schema ${schemaPath} ${inputPath} -o ${outputPath} && \
     mv ${schemaBackupPath} ${schemaPath}`,
    'Converting to OWL ontology failed.',
    (message) => message.replace(/(.*\n)+TypeError:(.*)/, '$2').trim()
  );
}

export function isFileEmpty(path) {
  return fs.statSync(path).size === 0;
}

export function collectEntities(context, ontologyName, inputPath) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const queryPath = resolve(processorHome, `src/utils/get-${ontologyName}-terms.sparql`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-terms.csv`);

  query(inputPath, queryPath, outputPath);
  throwOnError(`sed -i '1d' ${outputPath}`, 'Collect entities failed.');

  return outputPath;
}

export function filterClasses(context, ontologyName, classTermFile) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-filter.owl`);

  filter(ontologyPath, classTermFile, ['rdfs:label', 'http://www.geneontology.org/formats/oboInOwl#id', 'http://purl.obolibrary.org/obo/IAO_0000115'], outputPath);

  return outputPath;
}

export function extractClassHierarchy(context, ontologyName, upperTerm, lowerTerms, intermediates="all") {
  const { selectedDigitalObject: obj, processorHome } = context;

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-extract.owl`);

  extract(ontologyPath, upperTerm, lowerTerms, outputPath, intermediates);

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
    `find ${enrichedPath} ! -name 'enriched.ttl' ! -name 'enriched-metadata.ttl' ! -name 'redundant.ttl' -type f -exec rm -f {} +`,
    'Clean temporary files failed.'
  );
}

export function cleanDirectory(context) {
  const { selectedDigitalObject: obj } = context;
  const path = resolve(obj.path, 'enriched/');
  throwOnError(
    `find ${path} -type f -exec rm -f {} +`,
    'Clean enriched directory failed.'
  );
}

export function logOutput(outputPath) {
  more(`==> ${outputPath}`);
}
