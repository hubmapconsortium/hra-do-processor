import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';

export function readMetadata(obj) {
  return load(readFileSync(resolve(obj.path, 'raw/metadata.yaml')));
}

export function writeNormalized(obj, id, metadata, data) {
  sh.mkdir('-p', resolve(obj.path, 'normalized'));
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  writeFileSync(
    normalizedPath,
    dump({
      id,
      metadata,
      data,
    })
  );

  console.log('Normalized', obj.type, 'digital object written to', obj.doString + '/normalized/normalized.yaml');
}
