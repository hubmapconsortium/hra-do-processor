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
  isFileEmpty,
  logOutput,
} from './utils.js';

export function enrichWppMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
  const enrichedJson = resolve(obj.path, 'enriched/enriched-metadata.json');
  convertNormalizedMetadataToJson(context, normalizedPath, enrichedJson);
}

export function enrichWppData(context) {
  try {
    const { selectedDigitalObject: obj } = context;

    // Convert normalized data to graph data (.ttl)
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);
    logOutput(baseInputPath);

    let inputPaths = []; // variable to hold input files for merging

    info('Merging files:');
    const enrichedWithValidationPath = resolve(obj.path, 'enriched/enriched-with-validation.owl');
    inputPaths.push(baseInputPath);
    for (const inputPath of inputPaths) {
      more(` -> ${inputPath}`);
    }
    merge(inputPaths, enrichedWithValidationPath);
    logOutput(enrichedWithValidationPath);

    // Extract terms from reference ontologies to enrich the graph data
    inputPaths = [];

    const enrichedWithOntologyPath = resolve(obj.path, 'enriched/enriched-with-ontology.owl');

    inputPaths.push(enrichedWithValidationPath); // Set the enriched path as the initial

    info('Building class hierarchy from reference ontologies...');
    const uberonEntitiesPath = collectEntities(context, 'uberon', enrichedWithValidationPath);
    if (!isFileEmpty(uberonEntitiesPath)) {
      info('Extracting UBERON.');
      const uberonExtractPath = extractClassHierarchy(
        context,
        'uberon',
        'http://purl.obolibrary.org/obo/UBERON_0001062',
        uberonEntitiesPath
      );
      logOutput(uberonExtractPath);
      inputPaths.push(uberonExtractPath);
    }

    const clEntitiesPath = collectEntities(context, 'cl', enrichedWithValidationPath);
    if (!isFileEmpty(clEntitiesPath)) {
      info('Extracting CL.');
      const clExtractPath = extractClassHierarchy(
        context,
        'cl',
        'http://purl.obolibrary.org/obo/CL_0000000',
        clEntitiesPath
      );
      logOutput(clExtractPath);
      inputPaths.push(clExtractPath);
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
    info(`Creating asct-b: ${enrichedPath}`);
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
