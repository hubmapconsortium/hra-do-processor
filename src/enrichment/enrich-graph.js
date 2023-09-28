import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error, info } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import { cleanTemporaryFiles, convertNormalizedDataToOwl, convertNormalizedMetadataToRdf, logOutput } from './utils.js';

export function enrichGraphMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath, 'basic');
}

export function enrichGraphData(context) {
  try {
    const { selectedDigitalObject: obj } = context;

    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseGraphPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseGraphPath, 'basic');
    logOutput(baseGraphPath);

    info(`Reading data: ${normalizedPath}`);
    const digitalObjects = load(readFileSync(normalizedPath))['data'];

    info('Validating digital objects in the graph...');
    validateGraph(context, digitalObjects);

    const toMerge = [baseGraphPath];
    for (const inputRdfFile of digitalObjects) {
      const inputRdf = resolve(obj.path, 'raw', inputRdfFile);
      const extension = inputRdfFile.split('.').slice(-1)[0];
      if (extension === 'ttl') {
        toMerge.push(inputRdf);
      } else {
        const outputTtl = resolve(obj.path, 'enriched', inputRdfFile + '.ttl');
        convert(inputRdf, outputTtl, 'ttl');
        toMerge.push(outputTtl);
      }
    }

    const enrichedMergePath = resolve(obj.path, 'enriched/enriched-merge.owl');
    merge(toMerge, enrichedMergePath);
    logOutput(enrichedMergePath);

    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating graph: ${enrichedPath}`);
    convert(enrichedMergePath, enrichedPath, 'ttl');

    info('Optimizing graph...')
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

function validateGraph(context, data) {
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
