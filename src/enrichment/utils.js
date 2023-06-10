import { resolve } from 'path';
import { info, more } from '../utils/logging.js';
import { mergeTurtles } from '../utils/owl-cli.js';
import { redundant } from '../utils/relation-graph.js';
import { merge } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';

export function convertNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');
  const errorFile = resolve(obj.path, 'enriched/errors.yaml');

  info(`Using 'linkml-convert' to transform ${input}`);
  throwOnError(
    `linkml-convert ${skipValidation ? '--no-validate' : ''} --schema ${schema} ${input} -o ${output}`,
    'Enrichment failed.'
  );
  info(`Enriched digital object written to ${output}`);

  return output;
}

export function prettifyEnriched(context) {
  const { selectedDigitalObject: obj, processorHome } = context;
  const enriched = resolve(obj.path, 'enriched/enriched.ttl');
  const prefixes = resolve(processorHome, 'schemas/prefixes.json');
  mergeTurtles(enriched, prefixes, [enriched]);
}

export function convertNormalizedToOwl(context, inputPath, outputPath) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const schemaBackupPath = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml.bak`);

  info(`Using 'linkml-data2owl' to transform ${inputPath}`);
  throwOnError(
    `sed -i.bak 's|^id:.*|id: ${obj.iri}|' ${schemaPath} && \
     linkml-data2owl --output-type ttl --schema ${schemaPath} ${inputPath} -o ${outputPath} && \
     mv ${schemaBackupPath} ${schemaPath}`,
    'Converting to OWL ontology failed.',
    (message) => message.replace(/(.*\n)+TypeError:(.*)/, '$2').trim()
  );
}

export function runCompleteClosure(inputPath, outputPath) {
  redundant(inputPath, outputPath);
}

export function cleanTemporaryFiles(context) {
  const { selectedDigitalObject: obj } = context;
  const enrichedPath = resolve(obj.path, 'enriched/');
  throwOnError(
    `find ${enrichedPath} ! -name 'enriched.ttl' ! -name 'redundant.ttl' -type f -exec rm -f {} +`, 
    'Clean temporary files failed.'
  );
}

export function logOutput(outputPath) {
  more(`==> ${outputPath}`);
}