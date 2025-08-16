import { readFileSync } from 'fs';
import Papa from 'papaparse';
import { createHash } from 'crypto';


export function compareCSVFiles(csvPath1, csvPath2, options = {}) {
  const { softValidationHeader } = options;
  const errors = [];
  const warnings = [];

  try {
    // Parse both CSV files
    const csv1Data = parseCsvFile(csvPath1);
    const csv2Data = parseCsvFile(csvPath2);

    // Validate column headers
    validateHeaders(csv1Data.headers, csv2Data.headers, errors, warnings, options);

    // If headers are valid, compare row data
    if (errors.length === 0) {
      compareRows(csv1Data.rows, csv2Data.rows, csv2Data.headers, errors, warnings);
    }

  } catch (err) {
    errors.push({
      message: `CSV parsing failed: ${err.message}`,
      path: ''
    });
  }

  return {
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    errors,
    warnings,
    errorCount: errors.length,
    warningCount: warnings.length
  };
}

// Parse CSV file and return headers and rows
function parseCsvFile(csvPath) {
  const fileContent = readFileSync(csvPath, 'utf8');
  const parseResult = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true
  });

  if (parseResult.errors.length > 0) {
    throw new Error(`Papa parse errors: ${parseResult.errors.map(e => e.message).join(', ')}`);
  }

  const rows = parseResult.data;
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return { headers, rows };
}

// Validate that CSV headers match accordingly
function validateHeaders(headers1, headers2, errors, warnings, options = {}) {
  const { softValidationHeader } = options;

  if (softValidationHeader) {
    validateHeadersSoftly(headers1, headers2, warnings);
  } else {
    validateHeadersStrictly(headers1, headers2, errors);
  }
}

// Find missing columns in reconstructed table (headers2) compared to raw table (headers1)
function validateHeadersSoftly(headers1, headers2, warnings) {
  // Use case-insensitive comparison
const headers2Lower = headers2.map((h) => h.toLowerCase());
  const missingColumns = [];

  for (const header1 of headers1) {
    const header1Lower = header1.toLowerCase();
    if (!headers2Lower.includes(header1Lower)) {
      missingColumns.push(header1);
    }
  }

  if (missingColumns.length > 0) {
    warnings.push({
      path: 'column_headers',
      message: `Missing columns in reconstructed table: ${missingColumns.join(', ')}`,
    });
  }
}

// Check header count, their name and order
function validateHeadersStrictly(headers1, headers2, errors) {
  // Check header count
  if (headers1.length !== headers2.length) {
    errors.push({
      path: 'column_headers',
      message: `Column count mismatch: ${headers1.length} vs ${headers2.length}`
    });
    return;
  }

  // Check header names and order
  for (let pos = 0; pos < headers1.length; pos++) {
    if (headers1[pos] !== headers2[pos]) {
      errors.push({
        path: 'column_headers',
        position: pos,
        message: `Column header mismatch at position ${pos}: "${headers1[pos]}" vs "${headers2[pos]}"`
      });
    }
  }
}

// Compare CSV rows with order-independent matching
function compareRows(rows1, rows2, headers, errors, warnings) {
  // Check row count
  if (rows1.length !== rows2.length) {
    errors.push({
      path: 'rows',
      message: `Row count mismatch: ${rows1.length} vs ${rows2.length}`
    });
    return;
  }

  // Create hash maps for efficient matching
  const hashToRows1 = createRowHashMap(rows1, headers);
  const hashToRows2 = createRowHashMap(rows2, headers);

  const hashes1 = new Set(Object.keys(hashToRows1));
  const hashes2 = new Set(Object.keys(hashToRows2));

  // Find unmatched rows regardless the row ordering
  const unmatchedHashes = [...hashes1].filter(hash => !hashes2.has(hash));

  // If there are unmatched rows in the original data, perform an investigation.
  // IMPORTANT: This method assumes that the row order in both the original and 
  // reconstructed data is the same. If the order differs, the investigation results 
  // may be misleading.
  if (unmatchedHashes.length > 0) {
    const rowIndexesToInvestigate = unmatchedHashes.map(hash => hashToRows1[hash]._rowIndex);
    investigateUnmatchedRows(rowIndexesToInvestigate, rows1, rows2, headers, warnings);
  }
}

// Create hash map of row hash to row data for efficient lookup
function createRowHashMap(rows, headers) {
  const hashMap = {};
  
  rows.forEach((row, index) => {
    const hash = createRowHash(row, headers);
    // Use index + 1 to match expected numbering (1-based indexing)
    const rowNumber = index + 1; 
    const rowWithIndex = { ...row, _rowIndex: rowNumber };
    if (hashMap[hash]) {
      // Handle duplicate rows by appending index
      hashMap[`${hash}_${index}`] = rowWithIndex;
    } else {
      hashMap[hash] = rowWithIndex;
    }
  });
  
  return hashMap;
}

// Create deterministic hash for a row based on column values
function createRowHash(row, headers) {
  const values = headers.map(header => String(row[header] || '').trim());
  return createHash('md5').update(values.join('|')).digest('hex');
}

// Investigate unmatched rows
function investigateUnmatchedRows(rowIndexesToInvestigate, rows1, rows2, headers, warnings) {

  for (const rowIndex of rowIndexesToInvestigate) {
    for (const header of headers) {
      const value1 = String(rows1[rowIndex-1][header] || '').trim();
      const value2 = String(rows2[rowIndex-1][header] || '').trim();
      if (value1 !== value2) {
        // Try array-like comparison if values are different
        if (tryArrayComparison(value1, value2)) {
          // Values match when treated as arrays, continue to next column header
          continue;
        }
        // Write a warning message to report the difference
        warnings.push({
          column: header,
          row: rowIndex,
          original_value: value1,
          reconstructed_value: value2
        });
      }
    }
  }
}

// Check if two values are equal when treated as arrays (order-independent)
function tryArrayComparison(value1, value2) {
  // Try to parse values as arrays (assuming they might be delimited)
  const array1 = parseAsArray(value1);
  const array2 = parseAsArray(value2);
  
  // If both are arrays and have same length, compare order-independently
  if (Array.isArray(array1) && Array.isArray(array2) && array1.length === array2.length) {
    const sorted1 = [...array1].sort();
    const sorted2 = [...array2].sort();
    return sorted1.every((item, index) => item === sorted2[index]);
  }
  
  return false;
}

// Parse a string value as an array, detecting common delimiters
function parseAsArray(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  
  // Common delimiters: comma, semicolon, pipe
  const delimiters = [',', ';', '|', '\n', '\r\n'];
  
  for (const delimiter of delimiters) {
    if (value.includes(delimiter)) {
      return value.split(delimiter).map(item => item.trim()).filter(item => item.length > 0);
    }
  }
  
  // If no delimiter found, treat as single-item array if it looks like it could be part of an array
  return null;
}