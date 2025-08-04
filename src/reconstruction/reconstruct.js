import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import sh from 'shelljs';
import yaml from 'js-yaml';
import { header, error, info } from '../utils/logging.js';
import { reconstructAsctb } from './reconstruct-asct-b.js';
import { reconstructOmap } from './reconstruct-omap.js';
import { reconstructCtann } from './reconstruct-ctann.js';
import { reconstructRefOrgan } from './reconstruct-ref-organ.js';
import { reconstruct2dFtu } from './reconstruct-2d-ftu.js';
import { reconstructCollection } from './reconstruct-collection.js';
import { compareObjects, logValidationErrors } from './validation.js';
import { compareCSVFiles } from './csv-validation.js';
import { logValidationWarnings } from './validation-logging.js';

export function reconstruct(context) {
  const { selectedDigitalObject: obj } = context;
  sh.mkdir('-p', resolve(obj.path, 'reconstructed'));
  header(context, 'run-reconstruction');

  switch (obj.type) {
    case 'asct-b':
      reconstructAsctb(context);
      break;
    case 'omap':
      reconstructOmap(context);
      break;
    case 'ctann':
      reconstructCtann(context);
      break;
    case 'ref-organ':
      reconstructRefOrgan(context);
      break;
    case '2d-ftu':
      reconstruct2dFtu(context);
      break;
    case 'collection':
      reconstructCollection(context);
      break;
    default:
      error(`"${obj.type}" digital object type is not supported for reconstruction.`);
      break;
  }
  // Validate the reconstructed object
  validate(context)
}

function validate(context) {
  const { skipValidation, selectedDigitalObject: obj } = context;
  header(context, 'run-validation');
  if (skipValidation) {
    info('Skip validation.');
    return;
  }

  const doPath = resolve(obj.path);
  switch (obj.type) {
    case 'asct-b':
    case 'omap':
    case 'ctann':
      // Implement validation technique through comparing normalized results.
      break;
    case 'ref-organ':
    case '2d-ftu':
      validateCrosswalk(context, doPath);
      break;
    case 'collection':
      validateCollection(context, doPath);
      break;
  }
}


function validateCrosswalk(context, doPath) {
  const { selectedDigitalObject: obj } = context;
  const rawData = resolve(doPath, 'raw/crosswalk.csv');
  const reconstructedData = resolve(doPath, 'reconstructed/reconstructed.csv');

  // Check file existence
  if (!existsSync(rawData)) {
    error(`Raw crosswalk file not found: ${rawData}`);
    return;
  }
  if (!existsSync(reconstructedData)) {
    error(`Reconstructed crosswalk file not found: ${reconstructedData}`);
    return;
  }

  try {
    // Configure soft validation columns based on digital object type
    const softValidationColumns = getSoftValidationColumns(obj.type);
    
    // Compare CSV files with order-independent comparison
    const result = compareCSVFiles(rawData, reconstructedData, {
      softValidationColumns
    });

    // Report results
    if (result.hasErrors) {
      error(`Crosswalk validation failed with ${result.errorCount} errors`);
      logValidationErrors(result.errors, context, rawData, reconstructedData);
    } else if (result.hasWarnings) {
      info(`Crosswalk validation passed with ${result.warningCount} warnings`);
      logValidationWarnings(result.warnings, context, rawData, reconstructedData);
    } else {
      info('Crosswalk validation passed - files are identical');
    }
  } catch (err) {
    error(`Crosswalk validation error: ${err.message}`);
  }
}

/**
 * Get soft validation columns configuration for different digital object types
 */
function getSoftValidationColumns(objectType) {
  switch (objectType) {
    case 'ref-organ':
      return ['label'];
    case '2d-ftu':
      return ['node_label', 'tissue_label', 'organ_label'];
    default:
      return [];
  }
}


function validateCollection(context, doPath) {
  const rawData = resolve(doPath, 'raw/digital-objects.yaml');
  const reconstructedData = resolve(doPath, 'reconstructed/reconstructed.yaml');
  try {
    // Parse YAML files
    const rawContent = yaml.load(readFileSync(rawData, 'utf8'));
    const reconstructedContent = yaml.load(readFileSync(reconstructedData, 'utf8'));

    // Compare objects structurally and semantically
    const result = compareObjects(rawContent, reconstructedContent);

    if (result.hasErrors) {
      error(`Collection validation failed with ${result.errorCount} errors`);
      logValidationErrors(result.errors, context, rawData, reconstructedData);
    } else {
      info('Collection validation passed - files are identical');
    }
  } catch (err) {
    error(`Collection validation error: ${err.message}`);
  }
}
