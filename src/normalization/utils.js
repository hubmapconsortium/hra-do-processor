import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';
import { info } from '../utils/logging.js';

export function readMetadata(path) {
  return load(readFileSync(resolve(path, 'raw/metadata.yaml')));
}

export function writeNormalized(context, data) {
  const { path, iri } = context.selectedDigitalObject;
  const metadata = readMetadata(path);

  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(
    normalizedPath,
    dump({ id: iri, metadata, data })
  );
  info(`Normalized digital object written to ${normalizedPath}`);
}
