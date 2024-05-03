import fs from 'fs';
import { resolve } from 'path';
import { error, header, info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import {
  cleanTemporaryFiles,
  convertNormalizedMetadataToRdf,
  convertNormalizedDataToOwl,
  isFileEmpty,
  collectEntities,
  extractClassHierarchy,
  extractOntologySubset,
  excludeTerms,
  logOutput,
  push
} from './utils.js';

export function enrichRefOrganMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
}

export function enrichRefOrganData(context) {
  try {
    const { selectedDigitalObject: obj } = context;
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const ontologyPath = resolve(obj.path, 'enriched/ontology.ttl');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);
    logOutput(baseInputPath);

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
    info(`Creating ref-organ: ${enrichedPath}`);
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
