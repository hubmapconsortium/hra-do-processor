import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error } from '../utils/logging.js';
import { normalizeMetadata, readMetadata, writeNormalizedData, writeNormalizedMetadata } from './utils.js';

export function normalizeCollectionMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export function normalizeCollectionData(context) {
  const { path } = context.selectedDigitalObject;
  const metadata = readMetadata(context);

  const dataPath = resolve(path, 'raw', metadata.datatable[0]);
  const data = load(readFileSync(dataPath))['digital-objects'];
  checkCollectionItems(context, data);

  writeNormalizedData(context, data);
}

function checkCollectionItems(context, data) {
  let isValid = true;
  if (!context.skipValidation) {
    for (const collectedObj of data) {
      if (!existsSync(resolve(context.doHome, collectedObj, 'raw/metadata.yaml'))) {
        error(`${collectedObj} does not exist or is invalid`);
        isValid = false;
      }
    }
  }
  if (!isValid) {
    throw new Error(`Cannot normalize ${obj.doString} until all referenced digital objects are found.`);
  }
}
