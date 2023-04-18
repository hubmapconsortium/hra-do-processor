import { resolve } from 'path';
import { throwOnError } from '../utils/sh-exec.js';

export function convertNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');

  throwOnError(
    `linkml-convert ${skipValidation ? '--no-validate' : ''} --schema ${schema} ${input} -o ${output}`,
    'Enrichment failed. See errors above.'
  );

  return output;
}

export function convertNormalizedToOwl(context) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');

  throwOnError(
    `linkml-data2owl --output-type ttl --schema ${schema} ${input} -o ${output}`,
    'Enrichment failed. See errors above.'
  );

  return output;
}