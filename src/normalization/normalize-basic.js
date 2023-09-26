import { existsSync } from 'fs';
import { resolve } from 'path';
import { error } from '../utils/logging.js';
import {
  getDataDistributions,
  getMetadataIri,
  readMetadata,
  writeNormalizedData,
  writeNormalizedMetadata,
} from './utils.js';

export function normalizeBasicMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

function normalizeMetadata(context, metadata) {
  const normalizedMetadata = {
    iri: getMetadataIri(context),
    ...metadata,
    distributions: getDataDistributions(context),
  };
  delete normalizedMetadata.type;
  delete normalizedMetadata.name;
  return normalizedMetadata;
}

export function normalizeBasicData(context) {
  const metadata = readMetadata(context);
  const data = metadata.datatable;
  checkBasicItems(context, data);
  writeNormalizedData(context, data);
}

function checkBasicItems(context, data) {
  const { path } = context.selectedDigitalObject;
  let isValid = true;
  if (!context.skipValidation) {
    for (const collectedObj of data) {
      if (!existsSync(resolve(path, 'raw', collectedObj))) {
        error(`${collectedObj} does not exist or is invalid`);
        isValid = false;
      }
    }
  }
  if (!isValid) {
    throw new Error(`Cannot normalize ${obj.doString} until all referenced datatable items are found.`);
  }
}
