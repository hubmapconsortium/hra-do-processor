import { resolve } from 'path';
import { error, info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import {
  cleanTemporaryFiles,
  collectEntities,
  convertNormalizedDataToJson,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToJson,
  convertNormalizedMetadataToRdf,
  excludeTerms,
  extractClassHierarchy,
  extractOntologySubset,
  isFileEmpty,
  logOutput,
  push,
} from './utils.js';

export function enrichCtAnnMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
  const enrichedJson = resolve(obj.path, 'enriched/enriched-metadata.json');
  convertNormalizedMetadataToJson(context, normalizedPath, enrichedJson);
}

export function enrichCtAnnData(context) {
  try {
    const { selectedDigitalObject: obj } = context;

    // Convert normalized data to graph data (.ttl)
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);

    let inputPaths = []; // variable to hold input files for merging

    const enrichedWithOntologyPath = resolve(obj.path, 'enriched/enriched-with-ontology.owl');

    push(inputPaths, baseInputPath); // Set the enriched path as the initial
    push(inputPaths, extractOntologySubset(
      context, 'uberon', baseInputPath,
      ["BFO:0000050", "RO:0001025"] // part of, located in
    ));

    const fmaEntitiesPath = collectEntities(context, 'fma', baseInputPath);
    if (!isFileEmpty(fmaEntitiesPath)) {
      info('Extracting FMA.');
      const fmaExtractPath = extractClassHierarchy(
        context,
        'fma',
        'http://purl.org/sig/ont/fma/fma62955',
        fmaEntitiesPath);
      logOutput(fmaExtractPath);
      push(inputPaths, fmaExtractPath);
    }

    info('Merging files:');
    for (const inputPath of inputPaths) {
      more(` -> ${inputPath}`);
    }
    merge(inputPaths, enrichedWithOntologyPath);
    logOutput(enrichedWithOntologyPath);

    const trimmedOutputPath = resolve(obj.path, 'enriched/trimmed-output.ttl');
    info(`Excluding unwanted terms.`);
    excludeTerms(context, enrichedWithOntologyPath, trimmedOutputPath);

    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating ctann: ${enrichedPath}`);
    convert(trimmedOutputPath, enrichedPath, 'ttl');

    const enrichedJsonPath = resolve(obj.path, 'enriched/enriched.json');
    convertNormalizedDataToJson(context, normalizedPath, enrichedJsonPath);
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files...');
    cleanTemporaryFiles(context);
    more('Done.');
  }
}