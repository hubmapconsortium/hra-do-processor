import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';

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

  console.log('normalized', obj.type, 'digital object written to', obj.doString + '/normalized/normalized.yaml');
}
