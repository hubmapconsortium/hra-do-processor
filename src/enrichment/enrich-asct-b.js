import { resolve } from 'path';
import { error, info, more } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import {
  cleanTemporaryFiles,
  collectEntities,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToRdf,
  excludeTerms,
  extractClassHierarchy,
  isFileEmpty,
  logOutput,
} from './utils.js';

export function enrichAsctbMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
}

export function enrichAsctbData(context) {
  try {
    const { selectedDigitalObject: obj, processorHome } = context;

    // Convert normalized data to graph data (.ttl)
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
    convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);
    logOutput(baseInputPath);

    let inputPaths = []; // variable to hold input files for merging

    // Download CCF validation result to enrich the graph data
    info('Downloading ccf-validation-tool result...');
    const validationPath = downloadValidationResult(context);

    info('Merging files:');
    const enrichedWithValidationPath = resolve(obj.path, 'enriched/enriched-with-validation.owl');
    inputPaths.push(baseInputPath);
    inputPaths.push(validationPath);
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

    const fmaEntitiesPath = collectEntities(context, 'fma', enrichedWithValidationPath);
    if (!isFileEmpty(fmaEntitiesPath)) {
      info('Extracting FMA.');
      const fmaExtractPath = extractClassHierarchy(
        context,
        'fma',
        'http://purl.org/sig/ont/fma/fma62955',
        fmaEntitiesPath
      );
      logOutput(fmaExtractPath);
      inputPaths.push(fmaExtractPath);
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

    const pclEntitiesPath = collectEntities(context, 'pcl', enrichedWithValidationPath);
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

    const lmhaEntitiesPath = collectEntities(context, 'lmha', enrichedWithValidationPath);
    if (!isFileEmpty(lmhaEntitiesPath)) {
      info('Extracting LMHA.');
      const lmhaExtractPath = extractClassHierarchy(
        context,
        'lmha',
        'http://purl.obolibrary.org/obo/LMHA_00135',
        lmhaEntitiesPath
      );
      logOutput(lmhaExtractPath);
      inputPaths.push(lmhaExtractPath);
    }

    const hgncEntitiesPath = collectEntities(context, 'hgnc', enrichedWithValidationPath);
    if (!isFileEmpty(hgncEntitiesPath)) {
      info('Extracting HGNC.');
      const hgncExtractPath = extractClassHierarchy(
        context,
        'hgnc',
        'http://purl.bioontology.org/ontology/HGNC/gene',
        hgncEntitiesPath
      );
      logOutput(hgncExtractPath);
      inputPaths.push(hgncExtractPath);
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
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files...');
    cleanTemporaryFiles(context);
    more('Done.');
  }
}

function downloadValidationResult(context, useNightlyBuild = true) {
  const { name, path } = context.selectedDigitalObject;

  more(`Set useNightlyBuild = ${useNightlyBuild}`);

  const baseUrl = 'https://raw.githubusercontent.com/hubmapconsortium/ccf-validation-tools/master/owl';
  if (!useNightlyBuild) {
    baseUrl = `${baseUrl}/last_official_ASCTB_release`;
  }
  const organName = findOrganName(name);
  const input = `${baseUrl}/${organName}_extended.owl`;

  more(`Downloading file: ${input}`);

  const downloadPath = resolve(path, `enriched/${organName}_extended.owl`);
  const outputPath = resolve(path, `enriched/${name}-validation.owl`);
  throwOnError(`wget -nc -nv -q ${input} -O ${downloadPath}`, 'Download validation result failed.');

  convert(downloadPath, outputPath, 'owl');
  logOutput(outputPath);

  return outputPath;
}

function findOrganName(name) {
  const normalizeString = name.replace(/^(vh-)/, '');
  const titleCaseString = normalizeString.charAt(0).toUpperCase() + normalizeString.slice(1);
  const snakeCaseString = titleCaseString.replace(/-/g, '_');

  let outputName = snakeCaseString;
  // Handle special cases
  if (snakeCaseString === 'Bone_marrow') {
    outputName = 'Bone-Marrow';
  } else if (snakeCaseString === 'Spinal_cord') {
    outputName = 'Spinal_Cord';
  }
  return outputName;
}
