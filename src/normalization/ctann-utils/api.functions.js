import {
  CTANN_HEADER_FIRST_COLUMN,
  DELIMETER,
  TITLE_ROW_INDEX,
  Row,
  multiValueMetadataFields,
  metadataFieldMap,
} from './api.model.js';

const WarningCode = {};
WarningCode[(WarningCode['InvalidCsvFile'] = 1)] = 'InvalidCsvFile';
WarningCode[(WarningCode['UnmappedMetadata'] = 2)] = 'UnmappedMetadata';
WarningCode[(WarningCode['InvalidHeader'] = 3)] = 'InvalidHeader';
WarningCode[(WarningCode['MissingHeader'] = 4)] = 'MissingHeader';
WarningCode[(WarningCode['UnmappedData'] = 7)] = 'UnmappedData';
WarningCode[(WarningCode['BadColumn'] = 8)] = 'BadColumn';
WarningCode[(WarningCode['EmptyDataRow'] = 10)] = 'EmptyDataRow';

export function makeCtAnnData(table) {
  const headerIndex = findHeaderIndex(0, table, CTANN_HEADER_FIRST_COLUMN);
  const columnNames = table[headerIndex].map((col) => col.trim());

  // Initiate warning set.
  const warnings = new Set();

  // Build data key-value store.
  const headerNumber = headerIndex + 1;
  const dataRows = table.slice(headerNumber);
  const data = dataRows
    .map((dataRow, index) => {
      const rowNumber = headerNumber + index + 1;
      const recordNumber = index + 1;
      // Return null for empty rows
      if (dataRow.every((cell) => cell.trim() === '')) {
        warnings.add(
          `WARNING: Empty row is detected at Row: ${rowNumber} (Code ${WarningCode.EmptyDataRow})`
        );
        return null;
      }
      // Otherwise, build the row object
      const row = new Row(rowNumber, recordNumber);
      dataRow.forEach((value, colNumber) => {
        const colName = columnNames[colNumber];
        if (colNumber < columnNames.length && colName.length > 1) {
          row.set(colName, value);
        }
      });
      return row;
    })
    .filter((row) => row !== null);

  // Build metadata key-value store.
  const metadataRows = table.slice(0, headerIndex);
  const metadata = extractMetadata(metadataRows, warnings);
  // console.log([...warnings].sort().join('\n'));

  return {
    data: data,
    metadata: metadata,
    warnings: [...warnings],
  };
}

function findHeaderIndex(headerRow, data, firstColumnName) {
  for (let i = headerRow; i < data.length; i++) {
    if (data[i][0] === firstColumnName) {
      return i;
    }
  }
  return headerRow;
}

const extractMetadata = (metadataRows, warnings) => {
  const [titleRow] = metadataRows.splice(TITLE_ROW_INDEX, 1);
  const [title] = titleRow.slice(0, 1);
  const result = {
    title,
  };
  return metadataRows.reduce((metadata, metadataRow, rowNumber) => {
    const [metadataField, metadataValue, ..._] = metadataRow;
    // Skip blank rows
    if (!metadataField && !metadataValue) {
      return metadata;
    }

    // Validate the metadata value
    if (metadataField && !metadataValue) {
      warnings.add(
        `WARNING: Metadata value is missing at Row: ${rowNumber + 3} (Code ${WarningCode.UnmappedMetadata})`
      );
    }
    // Set the metadata key given the metadata field name.
    let metadataKey = metadataFieldMap[metadataField];
    if (!metadataKey) {
      metadataKey = metadataField.toLowerCase();
      warnings.add(
        `WARNING: Unmapped metadata found ${metadataField} at Row: ${rowNumber + 3} (Code ${
          WarningCode.UnmappedMetadata
        })`
      );
    }
    // Extract the value based on whether it is a multi-value field or not.
    if (multiValueMetadataFields.includes(metadataField)) {
      metadata[metadataKey] = metadataValue.split(DELIMETER).map((item) => item.trim());
    } else {
      metadata[metadataKey] = metadataValue.trim();
    }
    // Return the metadata object.
    return metadata;
  }, result);
};