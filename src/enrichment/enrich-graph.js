import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { error, info, more } from '../utils/logging.js';
import { RDF_EXTENSIONS, convert as rdfPipeConvert } from '../utils/reify.js';
import { merge, convert as robotConvert } from '../utils/robot.js';
import {
  cleanTemporaryFiles,
  convertNormalizedDataToJson,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToJson,
  convertNormalizedMetadataToRdf,
  logOutput,
  runCompleteClosure,
} from './utils.js';

export function enrichGraphMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath, 'basic');
  const enrichedJson = resolve(obj.path, 'enriched/enriched-metadata.json');
  convertNormalizedMetadataToJson(context, normalizedPath, enrichedJson, 'basic');
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

    info('Validating graph objects...');
    validateGraph(context, digitalObjects);

    info('Converting graph objects to Turtle format...');
    const toMerge = [baseGraphPath];
    for (const inputRdfFile of digitalObjects) {
      const inputRdf = resolve(obj.path, 'raw', inputRdfFile);
      more(` -> ${inputRdf}`);
      const extension = inputRdfFile.split('.').slice(-1)[0];
      if (extension === 'ttl') {
        toMerge.push(inputRdf);
      } else if (extension === 'owl') {
        const outputTtl = resolve(obj.path, 'enriched', inputRdfFile + '.ttl');
        robotConvert(inputRdf, outputTtl, 'ttl');
        toMerge.push(outputTtl);
      } else if (RDF_EXTENSIONS.has(extension)) {
        const outputTtl = resolve(obj.path, 'enriched', inputRdfFile + '.ttl');
        rdfPipeConvert(inputRdf, outputTtl, 'ttl');
        toMerge.push(outputTtl);
      }
    }

    info('Merging graph objects...');
    const enrichedMergePath = resolve(obj.path, 'enriched/enriched-merge.ttl');
    merge(toMerge, enrichedMergePath, 'ttl');
    logOutput(enrichedMergePath);

    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating graph: ${enrichedPath}`);
    rdfPipeConvert(enrichedMergePath, enrichedPath, 'ttl');

    info('Optimizing graph...');
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
