import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';
import { info } from '../utils/logging.js';

export function readMetadata(context) {
  const { path, type, name, version } = context.selectedDigitalObject;
  return {
    ...load(readFileSync(resolve(path, 'raw/metadata.yaml'))),
    type, name, version
  }
}

export function writeNormalized(context, data) {
  const { path, iri } = context.selectedDigitalObject;
  const metadata = readMetadata(context);

  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(
    normalizedPath,
    dump({ id: iri, metadata, data })
  );
  info(`Normalized digital object written to ${normalizedPath}`);
}
