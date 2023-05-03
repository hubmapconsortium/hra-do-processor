import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { info } from '../utils/logging.js';

export function readMetadata(path) {
  return load(readFileSync(resolve(path, 'raw/metadata.yaml')));
}

export function writeNormalized(context, data) {
  const { path, doString } = context.selectedDigitalObject;
  const id = `http://purl.humanatlas.io/${doString}`;
  const metadata = readMetadata(path);

  sh.mkdir('-p', resolve(path, 'normalized'));
  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(
    normalizedPath,
    dump({ id, metadata, data })
  );
  info(`Normalized digital object written to ${normalizedPath}`);
}
