import { resolve } from 'path';
import { error, header, info, more } from '../utils/logging.js';
import { convert, extract, merge, query } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import { cleanTemporaryFiles, convertNormalizedToOwl, runCompleteClosure } from './utils.js';

export function enrichAsctb(context) {
  header(context, 'run-enrich');
  try {
    const { selectedDigitalObject: obj, processorHome } = context;

    // Convert normalized data to graph data (.ttl)
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const ontologyPath = resolve(obj.path, 'enriched/ontology.ttl');
    convertNormalizedToOwl(context, normalizedPath, ontologyPath);

    let inputPaths = []; // variable to hold input files for merging

    // Download CCF validation result to enrich the graph data
    info('Downloading ccf-validation-tool result.');
    const validationPath = downloadValidationResult(context);

    info('Merging files:');
    const enrichedPath = resolve(obj.path, 'enriched/enriched.owl');
    inputPaths.push(ontologyPath);
    inputPaths.push(validationPath);
    for (const inputPath of inputPaths) {
      more(` -> ${inputPath}`);
    }
    merge(inputPaths, enrichedPath);

    // Extract terms from reference ontologies to enrich the graph data
    inputPaths = [];
    inputPaths.push(enrichedPath); // Set the enriched path as the initial

    info('Extracting UBERON terms.');
    const uberonEntitiesPath = collectEntities(context, 'uberon', enrichedPath);
    const uberonExtractPath = extractClassHierarchy(
      context,
      'uberon',
      'http://purl.obolibrary.org/obo/UBERON_0001062',
      uberonEntitiesPath
    );
    inputPaths.push(uberonExtractPath);

    info('Extracting FMA terms.');
    const fmaEntities = collectEntities(context, 'fma', enrichedPath);
    const fmaExtractPath = extractClassHierarchy(context, 'fma', 'http://purl.org/sig/ont/fma/fma62955', fmaEntities);
    inputPaths.push(fmaExtractPath);

    info('Extracting CL terms.');
    const clEntities = collectEntities(context, 'cl', enrichedPath);
    const clExtractPath = extractClassHierarchy(context, 'cl', 'http://purl.obolibrary.org/obo/CL_0000000', clEntities);
    inputPaths.push(clExtractPath);

    info('Extracting PCL terms.');
    const pclEntities = collectEntities(context, 'pcl', enrichedPath);
    const pclExtractPath = extractClassHierarchy(
      context,
      'pcl',
      'http://purl.obolibrary.org/obo/CL_0000000',
      clEntities
    );
    inputPaths.push(pclExtractPath);

    info('Extracting LMHA terms.');
    const lmhaEntities = collectEntities(context, 'lmha', enrichedPath);
    const lmhaExtractPath = extractClassHierarchy(
      context,
      'lmha',
      'http://purl.obolibrary.org/obo/LMHA_00135',
      clEntities
    );
    inputPaths.push(lmhaExtractPath);

    info('Extracting HGNC terms.');
    const hgncEntities = collectEntities(context, 'hgnc', enrichedPath);
    const hgncExtractPath = extractClassHierarchy(
      context,
      'hgnc',
      'http://purl.bioontology.org/ontology/HGNC/gene',
      hgncEntities
    );
    inputPaths.push(hgncExtractPath);

    info('Merging files:');
    for (const inputPath of inputPaths) {
      more(` -> ${inputPath}`);
    }
    merge(inputPaths, enrichedPath);

    info('Running the complete inference closure process.');
    const roPath = resolve(processorHome, `mirrors/ro.owl`);
    const roEnrichedPath = resolve(obj.path, 'enriched/ro-enriched.owl');
    merge([enrichedPath, roPath], roEnrichedPath);
    runCompleteClosure(context, roEnrichedPath, enrichedPath);

    const turtleEnrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating asct-b: ${turtleEnrichedPath}`);
    convert(enrichedPath, turtleEnrichedPath, 'ttl');
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
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

function collectEntities(context, ontologyName, inputPath) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const queryPath = resolve(processorHome, `src/utils/get-${ontologyName}-terms.sparql`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-terms.csv`);

  query(inputPath, queryPath, outputPath);
  throwOnError(`sed -i '1d' ${outputPath}`, 'Collect entities failed.');

  return outputPath;
}

function extractClassHierarchy(context, ontologyName, upperTerm, lowerTerms) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const ontologyPath = resolve(processorHome, `mirrors/${ontologyName}.owl`);
  const outputPath = resolve(obj.path, `enriched/${ontologyName}-extract.owl`);

  more(`Extracting terms from: ${ontologyPath}`);
  extract(ontologyPath, upperTerm, lowerTerms, outputPath);

  return outputPath;
}
