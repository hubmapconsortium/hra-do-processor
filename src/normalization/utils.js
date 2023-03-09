import { readFileSync, writeFileSync } from 'fs';
import { load, dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';

export function readMetadata(obj) {
  return load(readFileSync(resolve(obj.path, 'raw/metadata.yaml')));
}

export function writeNormalized(obj, metadata, data) {
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  writeFileSync(
    normalizedPath,
    dump({
      metadata,
      data,
    })
  );
}

export function validateNormalized(obj, processorHome) {
  const jsonSchema = resolve(processorHome, 'schemas/generated/json-schema', `${obj.type}.schema.json`);
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const resultString = sh.exec(`check-jsonschema -o json --schemafile ${jsonSchema} ${normalizedPath}`, {
    silent: true,
  });
  const results = JSON.parse(resultString);
  if (results.status === 'fail') {
    writeFileSync(resolve(obj.path, 'normalized/errors.yaml'), dump(results));
  }
  return results.status !== 'fail';
}
