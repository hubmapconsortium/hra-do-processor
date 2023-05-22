import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { runCompleteClosure, cleanTemporaryFiles } from './utils.js';
import { merge, convert } from '../utils/robot.js';
import { header, info, error, more } from '../utils/logging.js';

export function enrichCollection(context) {
  header(context, 'run-enrich');
  try {
    const { selectedDigitalObject: obj, processorHome } = context;

    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');

    info(`Reading data: ${normalizedPath}`)
    const digitalObjects = load(readFileSync(normalizedPath))['data'];
   
    info('Validating digital objects in the collection.');
    validateCollection(context, digitalObjects);

    info('Merging files:');
    const doPaths = digitalObjects.map(
      (doId) => resolve(context.doHome, doId, 'enriched/enriched.ttl')
    );
    const enrichedPath = resolve(obj.path, 'enriched/enriched.owl');
    for (const doPath of doPaths) {
      more(` -> ${doPath}`);
    } 
    merge(doPaths, enrichedPath);

    info('Running the complete inference closure process.');
    const roPath = resolve(processorHome, `mirrors/ro.owl`);
    const roEnrichedPath = resolve(obj.path, 'enriched/ro-enriched.owl');
    merge([roPath, enrichedPath], roEnrichedPath);
    runCompleteClosure(context, roEnrichedPath, enrichedPath);

    const turtleEnrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating collection: ${turtleEnrichedPath}`);
    convert(enrichedPath, turtleEnrichedPath, "ttl");
  } catch (e) {
    error(e)
  } finally {
    // Clean up
    info('Cleaning up temporary files.')
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
