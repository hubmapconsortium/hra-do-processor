import chalk from 'chalk';
import { resolve } from 'path';
import { convertNormalizedToOwl, downloadValidationResult } from './utils.js';
import { extractClassHierarchy, mergeOntologies } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';

export function enrichAsctb(context) {
  try {
    // Convert normalized data to graph data (.ttl)
    overrideSchemaId(context);
    const enrichedData = convertNormalizedToOwl(context);
    revertChanges(context);
    
    // Include asssertions from the CCF validation tool to enrich the graph data
    const mainResults = downloadValidationResult(context, "main");
    const extendedResults = downloadValidationResult(context, "extended");

    // Merge all the resources
    const validatedData = mergeOntologies(context, [
      enrichedData,
      mainResults, 
      extendedResults
    ]);

    // Include assertions from the reference ontologies to enrich the graph data
    const uberonExtract = extractClassHierarchy(context, "uberon", validatedData);
    const fmaExtract = extractClassHierarchy(context, "fma", validatedData);
    const clExtract = extractClassHierarchy(context, "cl", validatedData);
    const hgncExtract = extractClassHierarchy(context, "hgnc", validatedData);

    // Merge all the resources
    mergeOntologies(context, [
      validatedData,
      uberonExtract,
      fmaExtract,
      clExtract,
      hgncExtract
    ]);

    // Clean up
    cleanTemporaryFiles(context);
  }
  catch (e) {
    console.log(chalk.red(e));
  }
}

function overrideSchemaId(context) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const newId = `http://purl.humanatlas.io/${obj.doString}`;
  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);

  throwOnError(
    `sed -i.bak 's|^id:.*|id: ${newId}|' ${schema}`,
    'Override schema id failed. See errors above.'
  );
}

function revertChanges(context) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const originalSchema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml.bak`);
  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);

  throwOnError(
    `mv ${originalSchema} ${schema}`,
    'Revert schema changes failed. See errors above.'
  );
}

function cleanTemporaryFiles(context) {
  const { selectedDigitalObject: obj } = context;

  const enrichedPath = resolve(obj.path, "enriched/");

  throwOnError(
    `find ${enrichedPath} ! -name 'enriched.ttl' -type f -exec rm -f {} +`,
    'Clean temporary files failed. See errors above.'
  );
}
