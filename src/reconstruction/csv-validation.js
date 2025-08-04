import { readFileSync } from 'fs';
import Papa from 'papaparse';
import { createHash } from 'crypto';


export function compareCSVFiles(csvPath1, csvPath2, options = {}) {
  const { softValidationColumns = [] } = options;
  const errors = [];
  const warnings = [];

  try {
    // Parse both CSV files
    const csv1Data = parseCsvFile(csvPath1);
    const csv2Data = parseCsvFile(csvPath2);

    // Validate column headers
    validateHeaders(csv1Data.headers, csv2Data.headers, errors);

    // If headers are valid, compare row data
    if (errors.length === 0) {
      compareRows(csv1Data.rows, csv2Data.rows, csv1Data.headers, softValidationColumns, errors, warnings);
    }

  } catch (err) {
    errors.push({
      type: 'parse_error',
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

/**
 * Validate that CSV headers match exactly in name and order
 */
function validateHeaders(headers1, headers2, errors) {
  // Check header count
  if (headers1.length !== headers2.length) {
    errors.push({
      type: 'structural',
      path: 'headers',
      message: `Column count mismatch: ${headers1.length} vs ${headers2.length}`
    });
    return;
  }

  // Check header names and order
  for (let i = 0; i < headers1.length; i++) {
    if (headers1[i] !== headers2[i]) {
      errors.push({
        type: 'structural',
        path: `headers[${i}]`,
        message: `Column header mismatch at position ${i}: "${headers1[i]}" vs "${headers2[i]}"`
      });
    }
  }
}

// Compare CSV rows with order-independent matching
function compareRows(rows1, rows2, headers, softValidationColumns, errors, warnings) {
  // Check row count
  if (rows1.length !== rows2.length) {
    errors.push({
      type: 'structural',
      path: 'rows',
      message: `Row count mismatch: ${rows1.length} vs ${rows2.length}`
    });
  }

  // Create hash maps for efficient matching
  const hashToRow1 = createRowHashMap(rows1, headers);
  const hashToRow2 = createRowHashMap(rows2, headers);

  const hashes1 = new Set(Object.keys(hashToRow1));
  const hashes2 = new Set(Object.keys(hashToRow2));

  // Find unmatched rows
  const unmatchedInRows1 = [...hashes1].filter(hash => !hashes2.has(hash));
  const unmatchedInRows2 = [...hashes2].filter(hash => !hashes1.has(hash));

  // Process unmatched rows - try soft validation
  processUnmatchedRows(unmatchedInRows1, unmatchedInRows2, hashToRow1, hashToRow2, 
                      headers, softValidationColumns, errors, warnings);
}

// Create hash map of row hash to row data for efficient lookup
function createRowHashMap(rows, headers) {
  const hashMap = {};
  
  rows.forEach((row, index) => {
    const hash = createRowHash(row, headers);
    if (hashMap[hash]) {
      // Handle duplicate rows by appending index
      hashMap[`${hash}_${index}`] = row;
    } else {
      hashMap[hash] = row;
    }
  });
  
  return hashMap;
}

// Create deterministic hash for a row based on column values
function createRowHash(row, headers) {
  const values = headers.map(header => String(row[header] || '').trim().toLowerCase());
  return createHash('md5').update(values.join('|')).digest('hex');
}

// Process unmatched rows with soft validation support
function processUnmatchedRows(unmatchedHashes1, unmatchedHashes2, hashToRow1, hashToRow2,
                            headers, softValidationColumns, errors, warnings) {
  
  // Try to match unmatched rows using soft validation
  const softMatches = [];
  
  for (const hash1 of unmatchedHashes1) {
    const row1 = hashToRow1[hash1];
    
    for (const hash2 of unmatchedHashes2) {
      const row2 = hashToRow2[hash2];
      
      const matchResult = attemptSoftMatch(row1, row2, headers, softValidationColumns);
      if (matchResult.isMatch) {
        softMatches.push({ hash1, hash2, differences: matchResult.differences });
        break;
      }
    }
  }

  // Remove soft-matched hashes from unmatched lists
  const softMatchedHashes1 = softMatches.map(m => m.hash1);
  const softMatchedHashes2 = softMatches.map(m => m.hash2);
  
  const reallyUnmatched1 = unmatchedHashes1.filter(h => !softMatchedHashes1.includes(h));
  const reallyUnmatched2 = unmatchedHashes2.filter(h => !softMatchedHashes2.includes(h));

  // Report soft matches as warnings
  softMatches.forEach(match => {
    match.differences.forEach(diff => {
      warnings.push({
        type: 'semantic',
        path: diff.column,
        message: `Soft validation difference in ${diff.column}: "${diff.value1}" vs "${diff.value2}"`
      });
    });
  });

  // Report really unmatched rows as errors
  reallyUnmatched1.forEach(hash => {
    const row = hashToRow1[hash];
    errors.push({
      type: 'semantic',
      path: 'rows',
      message: `Row missing in second CSV: ${JSON.stringify(row)}`
    });
  });

  reallyUnmatched2.forEach(hash => {
    const row = hashToRow2[hash];  
    errors.push({
      type: 'semantic',
      path: 'rows',
      message: `Row missing in first CSV: ${JSON.stringify(row)}`
    });
  });
}

// Attempt to match two rows using soft validation rules
function attemptSoftMatch(row1, row2, headers, softValidationColumns) {
  const differences = [];
  let hardDifferences = 0;

  for (const header of headers) {
    const value1 = String(row1[header] || '').trim();
    const value2 = String(row2[header] || '').trim();
    if (value1 !== value2) {
      const isSoftColumn = softValidationColumns.includes(header);
      if (isSoftColumn) {
        // This is a soft validation difference
        differences.push({
          column: header,
          value1,
          value2,
        });
      } else {
        // This is a hard difference
        hardDifferences++;
        break;
      }
    }
  }

  return {
    isMatch: hardDifferences === 0,
    differences
  };
}