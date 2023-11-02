import fs from 'fs';
import { resolve } from 'path';
import { error, header, info, more } from '../utils/logging.js';
import { convert, filter, merge, query } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import { 
  cleanTemporaryFiles, 
  convertNormalizedMetadataToRdf,
  convertNormalizedDataToOwl,
  isFileEmpty,
  collectEntities,
  extractClassHierarchy,
  excludeTerms,
  logOutput 
} from './utils.js';

export function enrich2dFtuMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
}

export function enrich2dFtuData(context) {
  try {
    const { selectedDigitalObject: obj, processorHome } = context;

    // Convert normalized data to graph data (.ttl)
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);
    logOutput(baseInputPath);

    let inputPaths = []; // variable to hold input files for merging

    const enrichedWithOntologyPath = resolve(obj.path, 'enriched/enriched-with-ontology.owl');

    inputPaths.push(baseInputPath); // Set the enriched path as the initial

    info('Getting concept details from reference ontologies...')
    const uberonEntitiesPath = collectEntities(context, 'uberon', baseInputPath);
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

    const fmaEntitiesPath = collectEntities(context, 'fma', baseInputPath);
    if (!isFileEmpty(fmaEntitiesPath)) {
      info('Extracting FMA.');
      const fmaExtractPath = extractClassHierarchy(
        context, 
        'fma', 
        'http://purl.org/sig/ont/fma/fma62955', 
        fmaEntitiesPath);
      logOutput(fmaExtractPath);
      inputPaths.push(fmaExtractPath);
    }

    const clEntitiesPath = collectEntities(context, 'cl', baseInputPath);
    if (!isFileEmpty(clEntitiesPath)) {
      info('Extracting CL.');
      const clExtractPath = extractClassHierarchy(
        context, 
        'cl', 
        'http://purl.obolibrary.org/obo/CL_0000000', 
        clEntitiesPath);
      logOutput(clExtractPath);
      inputPaths.push(clExtractPath);
    }

    const pclEntitiesPath = collectEntities(context, 'pcl', baseInputPath);
    if (!isFileEmpty(pclEntitiesPath)) {
      info('Extracting PCL.');
      const pclExtractPath = extractClassHierarchy(
        context,
        'pcl',
        'http://purl.obolibrary.org/obo/CL_0000000',
        pclEntitiesPath
      );
      logOutput(pclExtractPath);
      inputPaths.push(pclExtractPath);
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
    info(`Creating 2d-ftu: ${enrichedPath}`);
    convert(trimmedOutputPath, enrichedPath, 'ttl');

  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files...');
    cleanTemporaryFiles(context);
    more("Done.")
  }
}

