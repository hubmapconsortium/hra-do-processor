import { readFileSync } from 'fs';
import { logValidationErrors, logValidationWarnings } from './validation-logging.js';

export function validateTableMetadata(context, rawFilePath, reconstructedFilePath, options = {}) {
  const { startRow = 1, endRow = 10 } = options;
  const errors = [];
  const warnings = [];
  
  try {
    // Extract metadata sections based on specified row range
    const rawData = readFileSync(rawFilePath, 'utf8').split('\n');
    const reconstructedData = readFileSync(reconstructedFilePath, 'utf8').split('\n');
    
    const rawMetadata = rawData.slice(startRow - 1, endRow);
    const reconstructedMetadata = reconstructedData.slice(startRow - 1, endRow);
    
    // Validate metadata structure
    if (rawMetadata.length !== reconstructedMetadata.length) {
      errors.push({
        type: 'structural',
        path: `metadata_header[${startRow}-${endRow}]`,
        message: `Metadata row count mismatch in rows ${startRow}-${endRow}: ${rawMetadata.length} vs ${reconstructedMetadata.length}`
      });
      return createResult(errors, warnings, context, rawFilePath, reconstructedFilePath);
    }
    
    // Compare each metadata row
    for (let i = 0; i < rawMetadata.length; i++) {
      const rowNumber = startRow + i;
      const rawMetadataRow = rawMetadata[i].trim();
      const reconstructedMetadataRow = reconstructedMetadata[i].trim();
      
      if (rawMetadataRow !== reconstructedMetadataRow) {
        // Check if it's just a formatting difference
        const normRawMetadataRow = normalizeMetadataRow(rawMetadataRow);
        const normReconstructedMetadataRow = normalizeMetadataRow(reconstructedMetadataRow);
        // Throw a warning to notify manual evaluation
        if (normRawMetadataRow !== normReconstructedMetadataRow) {
          warnings.push({
            type: 'semantic',
            path: `metadata_header[${rowNumber}]`,
            message: `Metadata row ${rowNumber} mismatch: '${normRawMetadataRow}' vs '${normReconstructedMetadataRow}'`
          });
        }
      }
    }
  } catch (err) {
    errors.push({
      type: 'parse_error',
      path: `metadata_header[${startRow}-${endRow}]`,
      message: `Metadata validation failed: ${err.message}`
    });
  }
  
  return createResult(errors, warnings, context, rawFilePath, reconstructedFilePath);
}

// Normalize metadata string for comparison (handle quoting and spacing differences)
function normalizeMetadataRow(str) {
  const trimmed = str.trim();
  
  // Handle empty lines
  if (!trimmed || /^,*$/.test(trimmed)) {
    return ',';
  }
  
  // Parse CSV and get first two non-empty values
  const parts = parseCSVLine(trimmed);
  const nonEmpty = parts.filter(p => p);
  let key = nonEmpty[0] || '';
  let value = nonEmpty[1] || '';
  
  // Clean quotes and trailing colon
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  key = key.replace(/:$/, '');
  
  return `${key},${value}`;
}

// Parse CSV line respecting quoted fields
function parseCSVLine(line) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

function createResult(errors, warnings, context, rawFilePath, reconstructedFilePath) {
  const result = {
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    errors,
    warnings,
    errorCount: errors.length,
    warningCount: warnings.length
  };
  
  // Auto-log if context is provided
  if (context) {
    if (errors.length > 0) {
      logValidationErrors(errors, context, rawFilePath, reconstructedFilePath);
    }
    if (warnings.length > 0) {
      logValidationWarnings(warnings, context, rawFilePath, reconstructedFilePath);
    }
  }
  
  return result;
}