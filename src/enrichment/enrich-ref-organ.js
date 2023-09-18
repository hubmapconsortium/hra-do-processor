import fs from 'fs';
import { resolve } from 'path';
import { error, header, info, more } from '../utils/logging.js';
import { convert, filter, merge, query } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import {
  cleanTemporaryFiles,
  convertNormalizedMetadataToRdf,
  convertNormalizedDataToOwl,
  logOutput 
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

    inputPaths.push(baseInputPath); // Set the enriched path as the initial

    info('Getting concept details from reference ontologies...')
    const uberonEntitiesPath = collectEntities(context, 'uberon', baseInputPath);
    if (!isFileEmpty(uberonEntitiesPath)) {
      info('Extracting UBERON.');
      const uberonExtractPath = filterClasses(context, 'uberon', uberonEntitiesPath);
      logOutput(uberonExtractPath);
      inputPaths.push(uberonExtractPath);
    }

    const fmaEntitiesPath = collectEntities(context, 'fma', baseInputPath);
    if (!isFileEmpty(fmaEntitiesPath)) {
      info('Extracting FMA.');
      const fmaExtractPath = filterClasses(context, 'fma', fmaEntitiesPath);
      logOutput(fmaExtractPath);
      inputPaths.push(fmaExtractPath);
    }

    info('Merging files:');
    for (const inputPath of inputPaths) {
      more(` -> ${inputPath}`);
    }
    merge(inputPaths, enrichedWithOntologyPath);
    logOutput(enrichedWithOntologyPath);

    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');

    info(`Creating ref-organ: ${enrichedPath}`);
    convert(enrichedWithOntologyPath, enrichedPath, 'ttl');
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
  }
}

function isFileEmpty(path) {
  return fs.statSync(path).size === 0;
}

function collectEntities(context, ontologyName, inputPath) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const queryPath = resolve(processorHome, `src/utils/get-${ontologyName}-terms.sparql`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-terms.csv`);

  query(inputPath, queryPath, outputPath);
  throwOnError(`sed -i '1d' ${outputPath}`, 'Collect entities failed.');

  return outputPath;
}

function filterClasses(context, ontologyName, classTermFile) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-filter.owl`);

  filter(ontologyPath, classTermFile, ['rdfs:label', 'http://www.geneontology.org/formats/oboInOwl#id', 'http://purl.obolibrary.org/obo/IAO_0000115'], outputPath);

  return outputPath;
}
