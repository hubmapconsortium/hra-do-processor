import { resolve } from 'path';
import { info } from './logging.js';
import { logOnError } from './sh-exec.js';

export function validateNormalizedMetadata(context, overrideType) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schemaFile = resolve(
    processorHome,
    'schemas/generated/json-schema',
    `${overrideType || obj.type}-metadata.schema.json`
  );
  const dataFile = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const errorFile = resolve(obj.path, 'normalized/metadata-validation-errors.yaml');

  return validate(context, dataFile, schemaFile, errorFile);
}

export function validateNormalizedData(context, overrideType) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schemaFile = resolve(processorHome, 'schemas/generated/json-schema', `${overrideType || obj.type}.schema.json`);
  const dataFile = resolve(obj.path, 'normalized/normalized.yaml');
  const errorFile = resolve(obj.path, 'normalized/data-validation-errors.yaml');

  return validate(context, dataFile, schemaFile, errorFile);
}

function validate(context, dataFile, schemaFile, errorFile) {
  const { selectedDigitalObject: obj } = context;

  info(`Using 'check-jsonschema' to validate ${dataFile}`);
  const success = logOnError(
    `check-jsonschema -o json --schemafile ${schemaFile} ${dataFile}`,
    `ValidationError: The content was invalid!`,
    {
      errorFile: errorFile,
      errorParser: (message) => JSON.parse(message).errors,
    }
  );
  if (success) {
    info('No error found.');
  }
  return success;
}
