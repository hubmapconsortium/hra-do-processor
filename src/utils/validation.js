import { resolve } from 'path';
import { validateIri, IriValidationStrategy } from 'validate-iri';
import { info, warning } from './logging.js';
import { logOnError } from './sh-exec.js';

export function validateNormalizedMetadata(context, overrideType) {
  const { selectedDigitalObject: obj, processorHome } = context;

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
  const { selectedDigitalObject: obj, processorHome } = context;

  const schemaFile = resolve(processorHome, 'schemas/generated/json-schema', `${overrideType || obj.type}.schema.json`);
  const dataFile = resolve(obj.path, 'normalized/normalized.yaml');
  const errorFile = resolve(obj.path, 'normalized/data-validation-errors.yaml');

  return validate(context, dataFile, schemaFile, errorFile);
}

function validate(context, dataFile, schemaFile, errorFile) {
  info(`Using 'check-jsonschema' to validate ${dataFile}`);
  const success = logOnError(
    `check-jsonschema -o json --schemafile ${schemaFile} ${dataFile}`,
    `ValidationError: The content was invalid!`,
    {
      errorFile: errorFile
    }
  );
  if (success) {
    info('No error found.');
  }
  return success;
}

export function checkIfValidIri(iri, hint = null) {
  try {
    validateIri(iri, IriValidationStrategy.Pragmatic);
    return iri;
  } catch (e) {
    warning(`The ${hint || 'ID'} '${iri}' is not a vaid IRI. Please check the source metadata.`);
    return null;
  }
}

export function checkIfValidUrl(url, hint = null) {
  const regex = /^(http|https):\/\/[^ "]+$/;
  const isValid = regex.test(url);
  if (isValid) {
    return url;
  } else {
    warning(`The ${hint || 'ID'} '${url}' is not a vaid URL. Please check the source metadata.`);
    return null;
  }
}
