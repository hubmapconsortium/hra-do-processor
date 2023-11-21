import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error } from '../utils/logging.js';
import { 
  readMetadata, 
  normalizeMetadataOfCollection,
  writeNormalizedDataOfCollection, 
  writeNormalizedMetadataOfCollection
} from './utils.js';

export function normalizeCollectionMetadata(context) {
  const metadata = readMetadata(context);
  const doList = getDoList(context, metadata);
  const normalizedMetadata = normalizeMetadataOfCollection(context, metadata, doList);
  writeNormalizedMetadataOfCollection(context, normalizedMetadata);
}

export function normalizeCollectionData(context) {
  const metadata = readMetadata(context);
  const doList = getDoList(context, metadata);
  checkCollectionItems(context, doList);
  writeNormalizedDataOfCollection(context, doList);
}

function getDoList(context, metadata) {
  const { path } = context.selectedDigitalObject;
  const dataPath = resolve(path, 'raw', metadata.datatable[0]);
  return load(readFileSync(dataPath))['digital-objects'];
}

function checkCollectionItems(context, doList) {
  let isValid = true;
  if (!context.skipValidation) {
    for (const collectedObj of doList) {
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
