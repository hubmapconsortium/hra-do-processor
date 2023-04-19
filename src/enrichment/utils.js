import { resolve } from 'path';
import { throwOnError } from '../utils/sh-exec.js';

export function convertNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');

  throwOnError(
    `linkml-convert ${skipValidation ? '--no-validate' : ''} --schema ${schema} ${input} -o ${output}`,
    'Enrichment failed. See errors above.'
  );

  return output;
}

export function convertNormalizedToOwl(context) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');

  throwOnError(
    `linkml-data2owl --output-type ttl --schema ${schema} ${input} -o ${output}`,
    'Enrichment failed. See errors above.'
  );

  return output;
}

export function downloadValidationResult(context, outputType, useNightlyBuild=true) {
  const { selectedDigitalObject: obj, processorHome } = context;
  
  const baseUrl = "https://raw.githubusercontent.com/hubmapconsortium/ccf-validation-tools/master/owl";
  const organName = findOrganName(obj.name);
  let input;
  if (outputType === "main") {
    input = `${baseUrl}/ccf_${organName}_classes.owl`;
  } else if (outputType === "extended") {
    input = `${baseUrl}/${organName}_extended.owl`;
  }
  const download = resolve(obj.path, `enriched/${outputType}-${obj.name}-validation.owl`);
  const output = resolve(obj.path, `enriched/${outputType}-${obj.name}-validation.ttl`);

  throwOnError(
    `wget -nc -nv -q ${input} -O ${download} && \
     robot convert --input ${download} --format ttl -o ${output}`,
    'Download validation failed. See errors above.'
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