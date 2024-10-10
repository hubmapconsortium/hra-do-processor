import { error } from 'console';
import { resolve } from 'path';
import { info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import {
  cleanTemporaryFiles,
  collectEntities,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToRdf,
  excludeTerms,
  extractClassHierarchy,
  extractOntologySubset,
  isFileEmpty,
  push
} from './utils.js';

export function enrichDatasetGraphMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
}

export async function enrichDatasetGraphData(context) {
  try {
    const { selectedDigitalObject: obj } = context;
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);

    // Extract terms from reference ontologies to enrich the graph data
    const ontologyExtractionPaths = [];
    push(ontologyExtractionPaths, baseInputPath); // Set the base input path as the initial
    push(ontologyExtractionPaths, extractOntologySubset(
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
        fmaEntitiesPath
      );
      push(ontologyExtractionPaths, fmaExtractPath);
    }

    info('Merging files:');
    for (const inputPath of ontologyExtractionPaths) {
      more(` -> ${inputPath}`);
    }
    const enrichedWithOntologyPath = resolve(obj.path, 'enriched/enriched-with-ontology.owl');
    merge(ontologyExtractionPaths, enrichedWithOntologyPath);

    const trimmedOutputPath = resolve(obj.path, 'enriched/trimmed-output.ttl');
    info(`Excluding unwanted terms.`);
    excludeTerms(context, enrichedWithOntologyPath, trimmedOutputPath);

    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating ds-graph: ${enrichedPath}`);
    convert(trimmedOutputPath, enrichedPath, 'ttl');
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
    info('Done.');
  }
}
