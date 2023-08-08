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

export function writeNormalizedMetadata(context, metadata) {
  const { path, iri } = context.selectedDigitalObject;
  const normalizedPath = resolve(path, 'normalized/normalized-metadata.yaml');
  writeFileSync(
    normalizedPath,
    dump({ metadata })
  );
  info(`Normalized metadata written to ${normalizedPath}`);
}

export function writeNormalizedData(context, data) {
  const { path, iri } = context.selectedDigitalObject;
  const metadata = selectMetadata(readMetadata(context));

  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(
    normalizedPath,
    dump({ iri, metadata, data })
  );
  info(`Normalized digital object written to ${normalizedPath}`);
}

function selectMetadata({title, description, creators, version, creation_date, license, publisher }) {
  return { title, description, creators, version, creation_date, license, publisher };
}