// Converted from transpiled ccf-asct-reporter code:
// https://github.com/hubmapconsortium/ccf-asct-reporter/blob/main/asctb-api/src/functions/api.functions.ts

import {
  ASCT_HEADER_FIRST_COLUMN,
  DELIMETER,
  Row,
  TITLE_ROW_INDEX,
  arrayNameMap,
  createObject,
  metadataArrayFields,
  metadataNameMap,
  objectFieldMap,
} from './api.model.js';


// Converted from transpiled ccf-asct-reporter code:
// https://github.com/hubmapconsortium/ccf-asct-reporter/blob/main/asctb-api/src/utils/warnings.ts
const WarningCode = {};
WarningCode[(WarningCode['InvalidCsvFile'] = 1)] = 'InvalidCsvFile';
WarningCode[(WarningCode['UnmappedMetadata'] = 2)] = 'UnmappedMetadata';
WarningCode[(WarningCode['InvalidHeader'] = 3)] = 'InvalidHeader';
WarningCode[(WarningCode['MissingHeader'] = 4)] = 'MissingHeader';
WarningCode[(WarningCode['InvalidCharacter'] = 5)] = 'InvalidCharacter';
WarningCode[(WarningCode['MissingCTorAnatomy'] = 6)] = 'MissingCTorAnatomy';
WarningCode[(WarningCode['UnmappedData'] = 7)] = 'UnmappedData';
WarningCode[(WarningCode['BadColumn'] = 8)] = 'BadColumn';
WarningCode[(WarningCode['NoIdInCT1'] = 9)] = 'NoIdInCT1';

// Converted from transpiled ccf-asct-reporter code:
// https://github.com/hubmapconsortium/ccf-asct-reporter/blob/main/asctb-api/src/functions/lookup.functions.ts
export function fixOntologyId(id) {
  if (
    (id === null || id === void 0 ? void 0 : id.toLowerCase()) === 'n/a' ||
    (id === null || id === void 0 ? void 0 : id.toLowerCase()) === 'not found'
  ) {
    return '';
  }
  // Fix IDs from ASCT+B Tables. Ideally, these changes are made up stream for next release and no transformation is necessary
  if (id.startsWith('fma') && /[0-9]/.test(id[3])) {
    id = 'fma:' + id.slice(3);
  }
  id = id.replace('_', ':').replace('::', ':').replace(': ', ':').replace('fmaid:', 'FMA:').split(' ')[0].toUpperCase();
  id = id
    .split(':')
    .map((s) => s.trim())
    .join(':');
  id = id.replace(/[^A-Z0-9_:]+/g, '');
  return id;
}

export function normalizeCsvUrl(url) {
  if (url.startsWith('https://docs.google.com/spreadsheets/d/') && url.indexOf('export?format=csv') === -1) {
    const splitUrl = url.split('/');
    if (splitUrl.length === 7) {
      const sheetId = splitUrl[5];
      const gid = splitUrl[6].split('=')[1];
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }
  }
  return url;
}

function setData(column, columnNumber, row, value, warnings) {
  if (column.length > 1) {
    const arrayName = arrayNameMap[column[0]];
    const originalArrayName = column[0];
    const objectArray = row[arrayName] || [];
    if (!arrayName) {
      warnings.add(`WARNING: unmapped array found ${originalArrayName} (Code ${WarningCode.UnmappedData})`);
    }
    if (column.length === 2) {
      if (objectArray.length === 0 && arrayName) {
        row[arrayName] = objectArray;
      }
      // Split combined biomarker tokens (if this is a biomarker array) into separate objects.
      const biomarkerArrays = new Set(['BG','BGENE','BP','BPROTEIN','BL','BLIPID','BM','BMETABOLITES','BF','BPROTEOFORM']);
      let tokens = [value];
      if (value && typeof value === 'string' && biomarkerArrays.has(originalArrayName.toUpperCase())) {
        const escapeForCharClass = (s) => s.replace(/[-\\\]^]/g, '\\$&');
        const delimChars = escapeForCharClass(DELIMETER) + ',|';
        const separators = new RegExp('[' + delimChars + ']+' );
        tokens = value.split(separators).map((s) => s.trim()).filter(Boolean);
      }
      for (const token of tokens) {
        objectArray.push(createObject(token, originalArrayName));
      }
    } else if (column.length === 3 && arrayName) {
      let arrayIndex = parseInt(column[1], 10) - 1;
      const fieldName = objectFieldMap[column[2]]; // || (column[2]?.toLowerCase() ?? '').trim();
      if (arrayIndex >= 0 && fieldName) {
        if (arrayIndex >= objectArray.length) {
          warnings.add(`WARNING: blank cells likely found in column: ${column.join('/')}, row: ${row.rowNumber}`);
        }
        // FIXME: Temporarily deal with blank columns since so many tables are non-conformant
        arrayIndex = objectArray.length - 1;
        if (arrayIndex < objectArray.length) {
          switch (fieldName) {
            case 'id':
              value = originalArrayName !== 'REF' ? fixOntologyId(value) : value;
              break;
          }
          if (objectArray[arrayIndex]) {
            objectArray[arrayIndex][fieldName] = value;
          } else {
            warnings.add(`WARNING: bad column: ${column.join('/')} (Code ${WarningCode.BadColumn})`);
          }
        }
      }
    }
  }
}


const invalidCharacterRegex = /_/gi;
const isLinkRegex = /^http/gi;
const codepointUppercaseA = 65;
const alphabetLength = 26;

function columnIndexToName(index) {
  index = index + 1;
  const name = [];
  while (index) {
    const mod = (index - 1) % alphabetLength;
    index = Math.floor(Number((index - mod) / alphabetLength));
    name.unshift(String.fromCharCode(codepointUppercaseA + Number(mod)));
  }
  return name.join('');
}

function validateDataCell(value, rowIndex, columnIndex, warnings) {
  if (!isLinkRegex.test(value) && invalidCharacterRegex.test(value)) {
    const colName = columnIndexToName(columnIndex);
    warnings.add(
      `WARNING: Invalid characters in data cell at column: ${colName} row: ${
        rowIndex + 1
      } where data cell: ${value} (Code ${WarningCode.InvalidCharacter})`
    );
  }
}

/*
 * buildMetadata - build metadata key value store
 * @param metadataRows = rows from metadata to be extracted
 * @param warnings = warnings generated during the process are pushed to this set
 * @returns = returns key value pairs of metadata
 */
export const buildMetadata = (metadataRows, warnings) => {
  const [titleRow] = metadataRows.splice(TITLE_ROW_INDEX, 1);
  const [title] = titleRow.slice(0, 1);
  const result = {
    title,
  };
  return metadataRows.reduce((metadata, rowData, rowNumber) => {
    const [metadataIdentifier, metadataValue, ..._] = rowData;
    /**
     * Raise Warnings:
     *    Case 1: IF the Metadata Key/Value is filled or empty
     *    Case 2: IF the metadata key is not mapping with metadataNameMap
     */
    if (!metadataIdentifier) {
      warnings.add(
        `WARNING: Metadata Key missing found at Row: ${rowNumber + 3} (Code ${WarningCode.UnmappedMetadata})`
      );
      return metadata;
    } else if (!metadataValue) {
      warnings.add(
        `WARNING: Metadata Value missing found at Row: ${rowNumber + 3} (Code ${WarningCode.UnmappedMetadata})`
      );
    }
    let metadataKey = metadataNameMap[metadataIdentifier];
    if (!metadataKey) {
      metadataKey = metadataIdentifier.toLowerCase();
      warnings.add(
        `WARNING: unmapped metadata found ${metadataIdentifier} at Row: ${rowNumber + 3} (Code ${
          WarningCode.UnmappedMetadata
        })`
      );
    }
    if (metadataArrayFields.includes(metadataKey)) {
      metadata[metadataKey] = metadataValue.split(DELIMETER).map((item) => item.trim());
    } else {
      metadata[metadataKey] = metadataValue.trim();
    }
    return metadata;
  }, result);
};

export function findHeaderIndex(headerRow, data, firstColumnName) {
  for (let i = headerRow; i < data.length; i++) {
    if (data[i][0] === firstColumnName) {
      return i;
    }
  }
  return headerRow;
}
function validateHeaderRow(headerData, rowIndex, warnings) {
  let columnIndex = 0;
  headerData.forEach((value) => {
    /**
     * Validate the Header of length 3: i.e after splitting header with ("/")
     */
    if (value.length === 3) {
      const colName = columnIndexToName(columnIndex);
      const invalidHeader = `WARNING: Invalid Header found at column: ${colName}, row: ${rowIndex} where Header Value: ${value.join(
        '/'
      )} (Code ${WarningCode.InvalidHeader})`;
      const columnBlank = value.join('').trim().length === 0;
      const col0Warnings = value[0].trim().length === 0 || !arrayNameMap[value[0].toUpperCase()];
      const col1Warnings = value[1].trim().length === 0 || Number.isNaN(parseInt(value[1]));
      const col2Warnings = value[2].trim().length === 0 || !objectFieldMap[value[2]];
      const showWarnings = col0Warnings || col1Warnings || col2Warnings;
      if (columnBlank) {
        warnings.add(
          `WARNING: Blank Header found at column: ${colName}, row: ${rowIndex} (Code ${WarningCode.MissingHeader})`
        );
      } else if (showWarnings) {
        warnings.add(invalidHeader);
      }
    }
    /**
     * Validate the Header of length 2: i.e after splitting header with ("/")
     */
    if (value.length === 2) {
      const colName = columnIndexToName(columnIndex);
      const invalidHeader = `WARNING: Invalid Header found at column: ${colName}, row: ${rowIndex} where Header Value: ${value.join(
        '/'
      )} (Code ${WarningCode.InvalidHeader})`;
      const columnBlank = value.join('').trim().length == 0;
      const col0Warnings = value[0].trim().length === 0 || !arrayNameMap[value[0].toUpperCase()];
      const col1Warnings = value[1].trim().length === 0 || Number.isNaN(parseInt(value[1]));
      const showWarnings = col0Warnings || col1Warnings;
      if (columnBlank) {
        warnings.add(
          `WARNING: Blank Header found at column: ${colName}, row: ${rowIndex} (Code ${WarningCode.MissingHeader})`
        );
      } else if (showWarnings) {
        warnings.add(invalidHeader);
      }
    }
    columnIndex = columnIndex + 1;
  });
}

function checkMissingIds(column, index, row, value, rowData, warnings) {
  var _a, _b, _c, _d;
  /**
   * check for missing Uberon/CL IDs:
   */
  const lastElement = column[column.length - 1];
  const isId = lastElement.toLowerCase() === objectFieldMap.ID;
  if (isId) {
    const nameValue =
      (_b = (_a = rowData[index - 2]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0
        ? _b
        : '';
    const idValue = value.trim();
    const labelValue =
      (_d = (_c = rowData[index - 1]) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0
        ? _d
        : '';
    if (nameValue) {
      if (!idValue) {
        const colName = columnIndexToName(index);
        warnings.add(
          `WARNING: Missing Uberon/CL ID at Column: ${colName}, Row: ${row.rowNumber + 1} (Code ${
            WarningCode.MissingCTorAnatomy
          })`
        );
      } else if (!labelValue) {
        const colName = columnIndexToName(index - 1);
        warnings.add(
          `WARNING: Missing RDFS Label for ID ${idValue} at Column: ${colName}, Row: ${row.rowNumber + 1} (Code ${
            WarningCode.MissingCTorAnatomy
          })`
        );
      }
      if (column.join('/') == 'CT/1/ID' && (!idValue || !idValue.startsWith('CL:'))) {
        const colName = columnIndexToName(index);
        warnings.add(
          `WARNING: CT/1/ID is not a CL ID (required) at Column: ${colName}, Row: ${row.rowNumber + 1} (Code ${
            WarningCode.NoIdInCT1
          })`
        );
      }
    }
  }
}

export function getHeaderRow(data, omapHeader, asctbHeader, legacyOmapHeader) {
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === omapHeader) {
      return data[i];
    }
    if (data[i][0] === asctbHeader) {
      return data[i];
    }
    if (data[i][0] === legacyOmapHeader) {
      return data[i];
    }
  }
  return undefined;
}

export function makeASCTBData(data) {
  const headerRow = findHeaderIndex(0, data, ASCT_HEADER_FIRST_COLUMN);
  const columns = data[headerRow].map((col) =>
    col
      .toUpperCase()
      .split('/')
      .map((s) => s.trim())
  );
  const warnings = new Set();
  validateHeaderRow(columns, headerRow + 2, warnings);
  const results = data.slice(headerRow + 1).map((rowData, rowNumber) => {
    const row = new Row(headerRow + rowNumber + 2);
    rowData.forEach((value, index) => {
      if (index < columns.length && columns[index].length > 1) {
        validateDataCell(value, row.rowNumber, index, warnings);
        setData(columns[index], index, row, value, warnings);
        checkMissingIds(columns[index], index, row, value, rowData, warnings);
      }
    });
    row.finalize();
    return row;
  });
  // build metadata key value store.
  const metadataRows = data.slice(0, headerRow);
  const metadata = buildMetadata(metadataRows, warnings);
  // console.log([...warnings].sort().join('\n'));
  return {
    data: results,
    metadata: metadata,
    warnings: [...warnings],
  };
}
