import { resolve } from 'path';
import { error, header, info } from '../utils/logging.js';
import { collectEntities, extractClassHierarchy, mergeOntologies } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import { convertNormalizedToOwl, downloadValidationResult, cleanTemporaryFiles } from './utils.js';

export function enrichAsctb(context) {
  header(context, 'run-enrich');
  try {
    // Convert normalized data to graph data (.ttl)
    overrideSchemaId(context);
    const enrichedData = convertNormalizedToOwl(context);
    revertChanges(context);
    
    info('Starting the data enrichment...')

    // Include asssertions from the CCF validation tool to enrich the graph data
    const validationResults = downloadValidationResult(context);

    // Merge all the resources
    const validatedData = mergeOntologies(context, [
      enrichedData,
      validationResults
    ]);

    // Include assertions from the reference ontologies to enrich the graph data
    const uberonEntities = collectEntities(context, "uberon", validatedData);
    const uberonExtract = extractClassHierarchy(context, "uberon",
      "http://purl.obolibrary.org/obo/UBERON_0001062", uberonEntities);
    
    const fmaEntities = collectEntities(context, "fma", validatedData);
    const fmaExtract = extractClassHierarchy(context, "fma", 
      "http://purl.org/sig/ont/fma/fma62955", fmaEntities);

    const clEntities = collectEntities(context, "cl", validatedData);
    const clExtract = extractClassHierarchy(context, "cl",
      "http://purl.obolibrary.org/obo/CL_0000000", clEntities);

    const hgncEntities = collectEntities(context, "hgnc", validatedData);
    const hgncExtract = extractClassHierarchy(context, "hgnc", 
      "http://purl.bioontology.org/ontology/HGNC/gene", hgncEntities);

    // Merge all the resources
    mergeOntologies(context, [
      validatedData,
      uberonExtract,
      fmaExtract,
      clExtract,
      hgncExtract
    ]);
  }
  catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.')
    cleanTemporaryFiles(context);
  }
}

function overrideSchemaId(context) {
  const { selectedDigitalObject: obj, processorHome } = context;
  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);

  throwOnError(
    `sed -i.bak 's|^id:.*|id: ${obj.iri}|' ${schema}`,
    'Override schema id failed.'
  );
}

function revertChanges(context) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const originalSchema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml.bak`);
  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);

  throwOnError(
    `mv ${originalSchema} ${schema}`,
    'Revert schema changes failed.'
  );
}
