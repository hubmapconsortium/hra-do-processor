import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';

export function validateNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  // Clear previous errors file before validating
  const errorFile = resolve(obj.path, 'normalized/errors.yaml');

  sh.rm('-f', errorFile);
  if (skipValidation) {
    return true;
  }

  const jsonSchema = resolve(processorHome, 'schemas/generated/json-schema', `${obj.type}.schema.json`);
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const resultString = sh.exec(`check-jsonschema -o json --schemafile ${jsonSchema} ${normalizedPath}`, {
    silent: true,
  });
  const results = JSON.parse(resultString);
  if (results.status === 'fail') {
    writeFileSync(errorFile, dump(results));
  }

  const isValid = results.status !== 'fail';
  if (!isValid) {
    console.log(
      chalk.red('Normalized', obj.type, 'digital object was invalid!'),
      'Check errors at',
      resolve(obj.path, 'normalized/errors.yaml')
    );
  }

  return isValid;
}
