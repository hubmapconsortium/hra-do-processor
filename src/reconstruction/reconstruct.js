import { resolve } from 'path';
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import sh from 'shelljs';
import yaml from 'js-yaml';
import { header, error, info } from '../utils/logging.js';
import { reconstructAsctb } from './reconstruct-asct-b.js';
import { reconstructOmap } from './reconstruct-omap.js';
import { reconstructCtann } from './reconstruct-ctann.js';
import { reconstructRefOrgan } from './reconstruct-ref-organ.js';
import { reconstruct2dFtu } from './reconstruct-2d-ftu.js';
import { reconstructCollection } from './reconstruct-collection.js';
import { compareObjects, logValidationErrors } from './json-validation.js';
import { compareCSVFiles } from './csv-validation.js';
import { logValidationWarnings } from './validation-logging.js';
import { validateTableMetadata } from './validate-table-metadata.js';

export function reconstruct(context) {
  const { selectedDigitalObject: obj } = context;
  // sh.mkdir('-p', resolve(obj.path, 'reconstructed'));
  // header(context, 'run-reconstruction');

  // switch (obj.type) {
  //   case 'asct-b':
  //     reconstructAsctb(context);
  //     break;
  //   case 'omap':
  //     reconstructOmap(context);
  //     break;
  //   case 'ctann':
  //     reconstructCtann(context);
  //     break;
  //   case 'ref-organ':
  //     reconstructRefOrgan(context);
  //     break;
  //   case '2d-ftu':
  //     reconstruct2dFtu(context);
  //     break;
  //   case 'collection':
  //     reconstructCollection(context);
  //     break;
  //   default:
  //     error(`"${obj.type}" digital object type is not supported for reconstruction.`);
  //     break;
  // }
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
      break;
    case 'omap':
      break;
    case 'ctann':
      validateTableWithMetadata(context, doPath);
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

// Validate DO that use a table with metadata as the raw data
function validateTableWithMetadata(context, doPath) {
  const { selectedDigitalObject: obj } = context;
  const rawData = resolve(doPath, `raw/${getRawData(obj)}`);
  const reconstructedPath = resolve(doPath, 'reconstructed');
  const reconstructedData = resolve(reconstructedPath, 'reconstructed.csv');

  // Check file existence
  if (!existsSync(rawData)) {
    error(`Raw ctann crosswalk file not found: ${rawData}`);
    return;
  }
  if (!existsSync(reconstructedData)) {
    error(`Reconstructed ctann file not found: ${reconstructedData}`);
    return;
  }

  try {
    let allErrors = [];
    let allWarnings = [];
    
    // Validate the metadata header section (rows 1-10)
    info('Validating the table metadata...');
    const metadataValidationResult = validateTableMetadata(context, rawData, reconstructedData, { startRow: 1, endRow: 10});
    allErrors = allErrors.concat(metadataValidationResult.errors);
    allWarnings = allWarnings.concat(metadataValidationResult.warnings);
    
    // Validate the table content section (rows 11+)
    info('Validating the table content...');
    const rawContent = extractCsvContent(rawData, 11);
    const reconstructedContent = extractCsvContent(reconstructedData, 11);
    
    // Write temporary files for validation
    const tempRawPath = resolve(reconstructedPath, 'raw.tmp.csv');
    const tempReconstructedPath = resolve(reconstructedPath, 'reconstructed.tmp.csv');
    
    writeFileSync(tempRawPath, rawContent);
    writeFileSync(tempReconstructedPath, reconstructedContent);

    // Configure soft validation columns for ctann
    const softValidationColumns = getSoftValidationColumns(obj.type);
    
    // Compare CSV files with order-independent comparison
    const tableContentResult = compareCSVFiles(tempRawPath, tempReconstructedPath, {
      softValidationColumns
    });
    
    allErrors = allErrors.concat(tableContentResult.errors);
    allWarnings = allWarnings.concat(tableContentResult.warnings);

    // Clean up temporary files
    try {
      unlinkSync(tempRawPath);
      unlinkSync(tempReconstructedPath);
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }

    // Report combined results
    const hasErrors = allErrors.length > 0;
    const hasWarnings = allWarnings.length > 0;
    
    if (hasErrors) {
      error(`Validation failed with ${allErrors.length} errors and ${allWarnings.length} warnings`);
      logValidationErrors(allErrors, context, rawData, reconstructedData);
      if (hasWarnings) {
        logValidationWarnings(allWarnings, context, rawData, reconstructedData);
      }
    } else if (hasWarnings) {
      info(`Validation passed with ${allWarnings.length} warnings`);
      logValidationWarnings(allWarnings, context, rawData, reconstructedData);
    } else {
      info('Validation passed - files are identical');
    }
  } catch (err) {
    error(`Validation error: ${err.message}`);
  }
}

// Validate DO that use a crosswalk as the raw data
function validateCrosswalk(context, doPath) {
  const { selectedDigitalObject: obj } = context;
  const rawData = resolve(doPath, `raw/${getRawData(obj)}`);
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

function extractCsvContent(filePath, startRow) {
  const fileContent = readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  const startIndex = startRow - 1; // Convert to 0-based index
  
  if (startIndex >= lines.length) {
    throw new Error(`File ${filePath} has only ${lines.length} lines, cannot start from row ${startRow}`);
  }
  
  return lines.slice(startIndex).join('\n');
}

// Validate DO collection only
function validateCollection(context, doPath) {
  const { selectedDigitalObject: obj } = context;
  const rawData = resolve(doPath, `raw/${getRawData(obj)}`);
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

// Get raw data file based on its digital object type
function getRawData(obj) {
  switch (obj.type) {
    case 'ctann':
      return `${obj.name}-crosswalk.csv`;
    case 'ref-organ':
    case '2d-ftu':
      return "crosswalk.csv";
    case 'collection':
      return "digital-objects.yaml"
  }
}

// Get soft validation columns configuration for different digital object types
function getSoftValidationColumns(objectType) {
  switch (objectType) {
    case 'ref-organ':
      return ['label'];
    case '2d-ftu':
      return ['node_label', 'tissue_label', 'organ_label'];
    case 'ctann':
      return ['CL_Label'];
    default:
      return [];
  }
}