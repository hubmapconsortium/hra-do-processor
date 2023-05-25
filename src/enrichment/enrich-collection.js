import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error, header, info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import { cleanTemporaryFiles, convertNormalizedToOwl } from './utils.js';

export function enrichCollection(context) {
  header(context, 'run-enrich');
  try {
    const { selectedDigitalObject: obj } = context;

    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const ontologyPath = resolve(obj.path, 'enriched/ontology.ttl');
    convertNormalizedToOwl(context, normalizedPath, ontologyPath);

    info(`Reading data: ${normalizedPath}`);
    const digitalObjects = load(readFileSync(normalizedPath))['data'];

    info('Validating digital objects in the collection.');
    validateCollection(context, digitalObjects);

    info('Merging files:');
    const doPaths = [];
    doPaths.push(ontologyPath);
    digitalObjects.forEach((doId) => doPaths.push(resolve(context.doHome, doId, 'enriched/enriched.ttl')));
    const enrichedPath = resolve(obj.path, 'enriched/enriched.owl');
    for (const doPath of doPaths) {
      more(` -> ${doPath}`);
    }
    merge(doPaths, enrichedPath);

    const turtleEnrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating collection: ${turtleEnrichedPath}`);
    convert(enrichedPath, turtleEnrichedPath, 'ttl');
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
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
