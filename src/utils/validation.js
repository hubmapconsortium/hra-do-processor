import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { logOnError } from './sh-exec.js';
import { header, info } from './logging.js';

export function validateNormalizedData(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  header(context, 'run-validation');
  if (skipValidation) {
    info('Skip validation.');
    return true;
  }

  const jsonSchema = resolve(processorHome, 'schemas/generated/json-schema', `${obj.type}.schema.json`);
  const dataFile = resolve(obj.path, 'normalized/normalized.yaml');
  const errorFile = resolve(obj.path, 'normalized/errors.yaml');

  info(`Using 'check-jsonschema' to validate ${dataFile}`);
  const success = logOnError(
    `check-jsonschema -o json --schemafile ${jsonSchema} ${dataFile}`,
    `ValidationError: Normalized ${obj.type} digital object was invalid!`,
    {
      errorFile: errorFile,
      errorParser: (message) => (JSON.parse(message).errors),
    }
  );
  if (success) {
    info('No error found.');
  }
  return success;
}
