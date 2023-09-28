import { existsSync } from 'fs';
import { resolve } from 'path';
import { error } from '../utils/logging.js';
import { normalizeMetadata, readMetadata, writeNormalizedData, writeNormalizedMetadata } from './utils.js';

export function normalizeGraphMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export function normalizeGraphData(context) {
  const metadata = readMetadata(context);
  const data = metadata.datatable;
  checkGraphItems(context, data);
  writeNormalizedData(context, data);
}

function checkGraphItems(context, data) {
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
