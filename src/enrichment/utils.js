import { resolve } from 'path';
import { throwOnError } from '../utils/sh-exec.js';
import { info, more } from '../utils/logging.js';

export function convertNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');
  const errorFile = resolve(obj.path, 'enriched/errors.yaml');

  info(`Using 'linkml-convert' to transform ${input}`)
  throwOnError(
    `linkml-convert ${skipValidation ? '--no-validate' : ''} --schema ${schema} ${input} -o ${output}`,
    'Enrichment failed.'
  );
  info(`Enriched digital object written to ${output}`);

  return output;
}

export function convertNormalizedToOwl(context) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  const input = resolve(obj.path, 'normalized/normalized.yaml');
  const output = resolve(obj.path, 'enriched/enriched.ttl');
  const errorFile = resolve(obj.path, 'enriched/errors.yaml');

  info(`Using 'linkml-data2owl' to transform ${input}`)
  throwOnError(
    `linkml-data2owl --output-type ttl --schema ${schema} ${input} -o ${output}`,
    'Converting to OWL failed.',
    (message) => (message.replace(/(.*\n)+TypeError:(.*)/, '$2').trim())
  );
  info(`Enriched digital object written to ${output}`);

  return output;
}

export function downloadValidationResult(context, useNightlyBuild=true) {
  const { name, path } = context.selectedDigitalObject;
  
  const baseUrl = "https://raw.githubusercontent.com/hubmapconsortium/ccf-validation-tools/master/owl";
  if (!useNightlyBuild) {
    baseUrl = `${baseUrl}/last_official_ASCTB_release`
  }
  const organName = findOrganName(name);
  const input = `${baseUrl}/${organName}_extended.owl`;

  more(`Downloading from ccf-validation-tools: ${input}`);

  const download = resolve(path, `enriched/${name}-validation.owl`);
  const output = resolve(path, `enriched/${name}-validation.ttl`);
  throwOnError(
    `wget -nc -nv -q ${input} -O ${download} && \
     robot convert --input ${download} --format ttl -o ${output}`,
    'Download validation failed.'
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