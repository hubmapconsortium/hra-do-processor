import { resolve } from 'path';
import { redundant } from '../utils/relation-graph.js';
import { info, more } from '../utils/logging.js';
import { merge } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';

export function convertNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');
  const errorFile = resolve(obj.path, 'enriched/errors.yaml');

  info(`Using 'linkml-convert' to transform ${input}`)
  throwOnError(
    `linkml-convert ${skipValidation ? '--no-validate' : ''} --schema ${schema} ${input} -o ${output}`,
    'Enrichment failed.'
  );
  info(`Enriched digital object written to ${output}`);

  return output;
}

export function convertNormalizedToOwl(context, inputPath, outputPath) {
  const { selectedDigitalObject: obj, processorHome } = context;
  const schemaPath = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  info(`Using 'linkml-data2owl' to transform ${inputPath}`)
  throwOnError(
    `linkml-data2owl --output-type ttl --schema ${schemaPath} ${inputPath} -o ${outputPath}`,
    'Converting to OWL failed.',
    (message) => (message.replace(/(.*\n)+TypeError:(.*)/, '$2').trim())
  );
}

export function runCompleteClosure(context, inputPath, outputPath) {
  const { selectedDigitalObject: obj } = context;
  const closurePath = resolve(obj.path, 'enriched/closure.ttl');
  redundant(inputPath, closurePath);
  merge([inputPath, closurePath], outputPath);
}

export function cleanTemporaryFiles(context) {
  const { selectedDigitalObject: obj } = context;
  const enrichedPath = resolve(obj.path, "enriched/");
  throwOnError(
    `find ${enrichedPath} ! -name 'enriched.ttl' -type f -exec rm -f {} +`,
    'Clean temporary files failed.'
  );
}