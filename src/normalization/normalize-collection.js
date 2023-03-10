import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { readMetadata, writeNormalized } from './utils.js';

export function normalizeCollection(context) {
  const obj = context.selectedDigitalObject;
  const metadata = readMetadata(obj);

  const dataUrl = resolve(obj.path, 'raw', metadata.datatable);
  const data = load(readFileSync(dataUrl));

  writeNormalized(obj, metadata, data['digital-objects']);
}
