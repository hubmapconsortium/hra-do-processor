import { error } from 'console';
import { resolve } from 'path';
import { info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import {
  cleanTemporaryFiles,
  collectEntities,
  convertAsyncNormalizedDataToOwl,
  convertNormalizedDataToJson,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToJson,
  convertNormalizedMetadataToRdf,
  excludeTerms,
  extractClassHierarchy,
  extractOntologySubset,
  isFileEmpty,
  push,
} from './utils.js';

export function enrichDatasetGraphMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
  const enrichedJson = resolve(obj.path, 'enriched/enriched-metadata.json');
  convertNormalizedMetadataToJson(context, normalizedPath, enrichedJson);
}

export async function enrichDatasetGraphData(context) {
  try {
    const { selectedDigitalObject: obj } = context;
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');

    // Define paths for each module
    const moduleDonorPath = resolve(obj.path, 'enriched/module-donor.ttl');
    const moduleSamplePath = resolve(obj.path, 'enriched/module-sample.ttl');
    const moduleDatasetPath = resolve(obj.path, 'enriched/module-dataset.ttl');
    const moduleSpatialPath = resolve(obj.path, 'enriched/module-spatial.ttl');
    const moduleCellSummaryPath = resolve(obj.path, 'enriched/module-cell-summary.ttl');
    const moduleCollisionPath = resolve(obj.path, 'enriched/module-collision.ttl');
    const moduleCorridorPath = resolve(obj.path, 'enriched/module-corridor.ttl');
    const modulePaths = [moduleDonorPath, moduleSamplePath, moduleDatasetPath, moduleSpatialPath,
      moduleCellSummaryPath, moduleCollisionPath, moduleCorridorPath];

    // Run the conversion functions in parallel
    await Promise.all([
      convertToOwlPromise(context, normalizedPath, moduleDonorPath, 'donor'),
      convertToOwlPromise(context, normalizedPath, moduleSamplePath, 'sample'),
      convertToOwlPromise(context, normalizedPath, moduleDatasetPath, 'dataset'),
      convertToOwlPromise(context, normalizedPath, moduleSpatialPath, 'spatial'),
      convertToOwlPromise(context, normalizedPath, moduleCellSummaryPath, 'cell-summary'),
      convertToOwlPromise(context, normalizedPath, moduleCollisionPath, 'collision'),
      convertToOwlPromise(context, normalizedPath, moduleCorridorPath, 'corridor')
    ]);

    // Ensure merge is only executed after all conversions are complete
    info('All conversions complete. Starting merge.');

    info('Merging module files:');
    for (const modulePath of modulePaths) {
      more(` -> ${modulePath}`);
    }
    // Once all conversions are done, merge the results
    const baseInputPath = resolve(obj.path, 'enriched/base-input.owl');
    merge(modulePaths, baseInputPath);

    // Extract terms from reference ontologies to enrich the graph data
    const ontologyExtractionPaths = [];
    push(ontologyExtractionPaths, baseInputPath); // Set the base input path as the initial
    push(
      ontologyExtractionPaths,
      extractOntologySubset(
        context,
        'uberon',
        baseInputPath,
        ['BFO:0000050', 'RO:0001025'] // part of, located in
      )
    );

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

function convertToOwlPromise(context, normalizedPath, modulePath, moduleType) {
  return new Promise((resolve, reject) => {
    convertAsyncNormalizedDataToOwl(context, normalizedPath, modulePath, moduleType, (err) => {
      if (err) reject(error);
      else resolve();
    });
  });
}
