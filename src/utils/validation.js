import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { logOnError } from './sh-exec.js';

export function validateNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  if (skipValidation) {
    return true;
  }

  const jsonSchema = resolve(processorHome, 'schemas/generated/json-schema', `${obj.type}.schema.json`);
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const errorFile = resolve(obj.path, 'normalized/errors.yaml');

  const isValid = logOnError(
    `check-jsonschema -o json --schemafile ${jsonSchema} ${normalizedPath}`,
    `ValidationError: Normalized ${obj.type} digital object was invalid!`,
    {
      errorFile: errorFile,
      errorParser: (message) => (JSON.parse(message).errors),
    }
  );
  return isValid;
}
