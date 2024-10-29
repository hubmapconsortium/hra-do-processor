import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error, info } from '../utils/logging.js';
import {
  cleanTemporaryFiles,
  convertNormalizedDataToJson,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToJson,
  convertNormalizedMetadataToRdf,
  logOutput,
} from './utils.js';

export function enrichBasicMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath, 'basic');
  const enrichedJson = resolve(obj.path, 'enriched/enriched-metadata.json');
  convertNormalizedMetadataToJson(context, normalizedPath, enrichedJson, 'basic');
}

export function enrichBasicData(context) {
  try {
    const { selectedDigitalObject: obj } = context;

    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, enrichedPath, 'basic');
    logOutput(enrichedPath);

    info(`Reading data: ${normalizedPath}`);
    const digitalObjects = load(readFileSync(normalizedPath))['data'];

    info('Validating digital objects in the basic...');
    validateBasic(context, digitalObjects);

    const enrichedJsonPath = resolve(obj.path, 'enriched/enriched.json');
    convertNormalizedDataToJson(context, normalizedPath, enrichedJsonPath, 'basic');
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
    info('Done.');
  }
}

function validateBasic(context, data) {
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
    throw new Error(`Cannot enrich ${obj.doString} until all referenced datatable items are found.`);
  }
}
