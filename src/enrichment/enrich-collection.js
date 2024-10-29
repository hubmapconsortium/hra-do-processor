import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error, info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import {
  cleanTemporaryFiles,
  convertNormalizedDataToJson,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToJson,
  convertNormalizedMetadataToRdf,
  logOutput,
  runCompleteClosure,
} from './utils.js';

export function enrichCollectionMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
  const enrichedJson = resolve(obj.path, 'enriched/enriched-metadata.json');
  convertNormalizedMetadataToJson(context, normalizedPath, enrichedJson);
}

export function enrichCollectionData(context) {
  try {
    const { selectedDigitalObject: obj } = context;

    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);
    logOutput(baseInputPath);

    info(`Reading data: ${normalizedPath}`);
    const digitalObjects = load(readFileSync(normalizedPath))['data'];

    info('Validating digital objects in the collection...');
    validateCollection(context, digitalObjects);

    info('Consolidating all collection members...');
    info('Merging files:');
    const doPaths = [];
    doPaths.push(baseInputPath);
    digitalObjects.forEach((doId) => doPaths.push(resolve(context.doHome, doId, 'enriched/enriched.ttl')));
    const enrichedMergePath = resolve(obj.path, 'enriched/enriched-merge.owl');
    for (const doPath of doPaths) {
      more(` -> ${doPath}`);
    }
    merge(doPaths, enrichedMergePath);
    logOutput(enrichedMergePath);

    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating collection: ${enrichedPath}`);
    convert(enrichedMergePath, enrichedPath, 'ttl');

    info('Optimizing collection graph...');
    const redundantPath = resolve(obj.path, 'enriched/redundant.ttl');
    runCompleteClosure(enrichedPath, redundantPath);
    logOutput(redundantPath);

    const enrichedJsonPath = resolve(obj.path, 'enriched/enriched.json');
    convertNormalizedDataToJson(context, normalizedPath, enrichedJsonPath);
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
    info('Done.');
  }
}

function validateCollection(context, data) {
  const { selectedDigitalObject: obj, skipValidation, doHome } = context;
  let isValid = true;
  if (!skipValidation) {
    for (const collectedObj of data) {
      const enrichPath = resolve(doHome, collectedObj, 'enriched/enriched.ttl');
      if (!existsSync(enrichPath)) {
        error(`${collectedObj}/enriched/enriched.ttl does not exist or is invalid.`);
        isValid = false;
      }
    }
  }
  if (!isValid) {
    throw new Error(`Cannot enrich ${obj.doString} until all referenced digital objects are enriched.`);
  }
}
