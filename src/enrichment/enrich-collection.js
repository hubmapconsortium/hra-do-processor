import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error, header, info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import { cleanTemporaryFiles, convertNormalizedToOwl, runCompleteClosure, logOutput } from './utils.js';

export function enrichCollection(context) {
  header(context, 'run-enrich');
  try {
    const { selectedDigitalObject: obj } = context;

    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedToOwl(context, normalizedPath, baseInputPath);
    logOutput(baseInputPath);

    info(`Reading data: ${normalizedPath}`);
    const digitalObjects = load(readFileSync(normalizedPath))['data'];

    info('Validating digital objects in the collection...');
    validateCollection(context, digitalObjects);

    info('Consolidating all collection members...')
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

    info('Optimizing collection graph...')
    const redundantPath = resolve(obj.path, 'enriched/redundant.ttl');
    runCompleteClosure(enrichedPath, redundantPath);
    logOutput(redundantPath);

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
  let isValid = true;
  if (!context.skipValidation) {
    for (const collectedObj of data) {
      if (!existsSync(resolve(context.doHome, collectedObj, 'enriched/enriched.ttl'))) {
        error(`${collectedObj} does not exist or is invalid.`);
        isValid = false;
      }
    }
  }
  if (!isValid) {
    throw new Error(`Cannot enrich ${obj.doString} until all referenced digital objects are enriched.`);
  }
}
