import { resolve } from 'path';
import { convertNormalizedToOwl, 
         downloadValidationResult, 
         cleanTemporaryFiles } from './utils.js';
import { collectEntities, extractClassHierarchy, merge } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import { error, header, info, more } from '../utils/logging.js';

export function enrichAsctb(context) {
  header(context, 'run-enrich');
  try {
    const { selectedDigitalObject: obj } = context;

    // Convert normalized data to graph data (.ttl)
    overrideSchemaId(context);
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const graphPath = resolve(obj.path, 'enriched/graph.ttl');
    convertNormalizedToOwl(context, normalizedPath, graphPath);
    revertChanges(context);
    
    info('Starting the data enrichment...')

    // Download CCF validation result to enrich the graph data
    const validationPath = downloadValidationResult(context);
    const enrichedPath = resolve(obj.path, 'enriched.owl')
    merge([graphPath, validationPath], enrichedPath);

    // Extract terms from reference ontologies to enrich the graph data
    const uberonEntities = collectEntities(context, "uberon", validatedData);
    const uberonExtractPath = extractClassHierarchy(context, "uberon",
      "http://purl.obolibrary.org/obo/UBERON_0001062", uberonEntities);
    
    const fmaEntities = collectEntities(context, "fma", validatedData);
    const fmaExtractPath = extractClassHierarchy(context, "fma", 
      "http://purl.org/sig/ont/fma/fma62955", fmaEntities);

    const clEntities = collectEntities(context, "cl", validatedData);
    const clExtractPath = extractClassHierarchy(context, "cl",
      "http://purl.obolibrary.org/obo/CL_0000000", clEntities);

    const hgncEntities = collectEntities(context, "hgnc", validatedData);
    const hgncExtractPath = extractClassHierarchy(context, "hgnc", 
      "http://purl.bioontology.org/ontology/HGNC/gene", hgncEntities);

    merge([enrichedPath,
      uberonExtractPath,
      fmaExtractPath,
      clExtractPath,
      hgncExtractPath
    ], enrichedPath);

    const turtleEnrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    info(`Creating file: ${turtleEnrichedPath}`);
    convert(enrichedPath, turtleEnrichedPath, "ttl");
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

function downloadValidationResult(context, useNightlyBuild=true) {
  const { name, path } = context.selectedDigitalObject;
  
  const baseUrl = "https://raw.githubusercontent.com/hubmapconsortium/ccf-validation-tools/master/owl";
  if (!useNightlyBuild) {
    baseUrl = `${baseUrl}/last_official_ASCTB_release`
  }
  const organName = findOrganName(name);
  const input = `${baseUrl}/${organName}_extended.owl`;

  more(`Downloading from ccf-validation-tools: ${input}`);

  const download = resolve(path, `enriched/${organName}_extended.owl`);
  const output = resolve(path, `enriched/${name}-validation.owl`);
  throwOnError(
    `wget -nc -nv -q ${input} -O ${download} && \
     robot convert --input ${download} --format owl -o ${output}`,
    'Download validation result failed.'
  )
  return output;
}

function findOrganName(name) {
  const normalizeString = name.replace(/^(vh-)/, "");
  const titleCaseString = normalizeString.charAt(0).toUpperCase() + normalizeString.slice(1);
  const snakeCaseString = titleCaseString.replace(/-/g, "_");

  let outputName = snakeCaseString;
  // Handle special cases
  if (snakeCaseString === "Bone_marrow") {
    outputName = "Bone-Marrow";
  } else if (snakeCaseString === "Spinal_cord") {
    outputName = "Spinal_Cord";
  }
  return outputName;
}
