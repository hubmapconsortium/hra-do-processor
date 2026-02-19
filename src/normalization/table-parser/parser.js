import lodashSet from 'lodash.set';
import Papa from 'papaparse';

export const WarningCode = {};
WarningCode[(WarningCode['InvalidCsvFile'] = 1)] = 'InvalidCsvFile';
WarningCode[(WarningCode['UnmappedMetadata'] = 2)] = 'UnmappedMetadata';
WarningCode[(WarningCode['InvalidHeader'] = 3)] = 'InvalidHeader';
WarningCode[(WarningCode['MissingHeader'] = 4)] = 'MissingHeader';
WarningCode[(WarningCode['InvalidCharacter'] = 5)] = 'InvalidCharacter';
WarningCode[(WarningCode['MissingCTorAnatomy'] = 6)] = 'MissingCTorAnatomy';
WarningCode[(WarningCode['UnmappedData'] = 7)] = 'UnmappedData';
WarningCode[(WarningCode['BadColumn'] = 8)] = 'BadColumn';
WarningCode[(WarningCode['NoIdInCT1'] = 9)] = 'NoIdInCT1';

export class TableParser {
  constructor(options) {
    this.options = options ?? {};
    this.warnings = new Set();
    this.errors = [];
  }

  parseCsvData() {
    const { csvString = undefined, csvData = undefined } = this.options;

    if (csvString && !csvData) {
      const csvParsed = Papa.parse(csvString, { skipEmptyLines: 'greedy' });
      if (csvParsed.errors) {
        for (const err of csvParsed.errors) {
          this.errors.push(err.toString());
        }
      }
      this.csvData = csvParsed.data;
    } else if (Array.isArray(csvData)) {
      this.csvData = csvData;
    } else {
      this.csvData = [];
      this.errors.push(new Error('No CSV data provided!').toString());
    }
  }

  findHeaderRow() {
    const firstColumnName = this.options?.headerFirstColumnName ?? undefined;
    if (firstColumnName) {
      const data = this.csvData;
      for (let i = 0; i < data.length; i++) {
        if (data[i].includes(firstColumnName)) {
          return i;
        }
      }
    }
    return 0;
  }

  parseHeader() {
    const headerRow = (this.headerRow = this.findHeaderRow());
    const defaultObjectProp = this.options?.defaultObjectProp ?? 'name';
    const dataPropertyMapping = this.options?.dataPropertyMapping ?? {};

    const header = this.csvData?.[headerRow] ?? [];
    this.columns = header.map((col, columnNumber) => {
      const elements = col.split('/').map((s) => {
        s = s.toLowerCase().trim();
        return dataPropertyMapping[s] ?? s;
      });

      // Check if a column will be used to construct an object
      const isPartOfObject = header.some((otherCol) => col !== otherCol && otherCol.startsWith(col + '/'));
      if (isPartOfObject) {
        elements.push(defaultObjectProp);
      }
      return {
        columnNumber,
        label: col,
        path: elements
          .map((elt, index) => {
            if (Number.isInteger(Number(elt))) {
              elt = `${Number(elt) - 1}`; // Make zero-based array index
              // For columns that end in an array index, set the value in the default prop
              if (index === elements.length - 1) {
                elt = `${elt}.${defaultObjectProp}`;
              }
            }
            return elt;
          })
          .join('.'),
      };
    });
    if (!this.columns) {
      this.columns = [];
      this.errors.push(new Error('Header not found!'));
    }
  }

  parseMetadata() {
    const metadataRows = this.csvData.slice(0, this.headerRow);
    const metadataKeyMapping = this.options?.metadataKeyMapping ?? {};
    const metadataArrayFields = this.options?.metadataArrayFields ?? [];
    const optionalMetadata = new Set(this.options?.optionalMetadata ?? []);
    const delimeter = this.options?.metadataValueArrayDelimeter ?? ';';
    const titleRowIndex = this.options?.metadataTitleRow ?? undefined;
    const warnings = this.warnings;
    const ignoreUnmappedMetadata = this.options.ignoreUnmappedMetadata === true;

    const result = {};
    if (titleRowIndex !== undefined) {
      const [titleRow] = metadataRows.splice(titleRowIndex, 1);
      const [title] = titleRow?.slice(0, 1) ?? [];
      result.title = title;
    }

    metadataRows.reduce((metadata, rowData, rowNumber) => {
      const metadataIdentifier = rowData[0];
      const metadataValue = rowData
        .slice(1)
        .filter((s) => s.trim().length > 0)
        .map((s) => s.trim())
        .join(delimeter);
      let metadataKey = metadataKeyMapping[metadataIdentifier.toLowerCase()];
      if (!metadataKey && !ignoreUnmappedMetadata) {
        metadataKey = metadataIdentifier.toLowerCase();
        warnings.add(
          `WARNING: unmapped metadata found ${metadataIdentifier} at Row: ${rowNumber + 3} (Code ${
            WarningCode.UnmappedMetadata
          })`
        );
      } else if (!metadataKey && ignoreUnmappedMetadata) {
        return metadata;
      }
      /**
       * Raise Warnings:
       *    Case 1: IF the Metadata Key/Value is filled or empty
       *    Case 2: IF the metadata key is not mapping with metadataKeyMapping
       */
      if (!metadataIdentifier) {
        warnings.add(
          `WARNING: Metadata Key missing found at Row: ${rowNumber + 3} (Code ${WarningCode.UnmappedMetadata})`
        );
        return metadata;
      } else if (!metadataValue.trim() && !optionalMetadata.has(metadataKey)) {
        warnings.add(
          `WARNING: Metadata Value missing found at Row: ${rowNumber + 3} (Code ${WarningCode.UnmappedMetadata})`
        );
      }

      if (metadataValue.trim().length > 0) {
        if (metadataArrayFields.includes(metadataKey)) {
          metadata[metadataKey] = metadataValue.split(delimeter).map((item) => item.trim());
        } else {
          metadata[metadataKey] = metadataValue.trim();
        }
      }
      return metadata;
    }, result);

    this.metadata = result;
  }

  parseRows() {
    const headerRow = this.headerRow;
    const columns = this.columns;
    this.data = this.csvData.slice(headerRow + 1).map((rowData, rowNumber) => {
      const record = { record_number: headerRow + rowNumber + 2 };

      // Populate the row with column values
      rowData.forEach((value, index) => {
        if (index < columns.length && columns[index].path.length > 0) {
          value = value?.trim() ?? '';
          if (value !== '') {
            lodashSet(record, columns[index].path, value);
          }
        }
      });

      // Add record and order numbers in objects and arrays where appropriate
      const purl = this.options.purl ?? '';
      record.id = `${purl}#R${record.record_number}`;
      for (let [key, value] of Object.entries(record)) {
        const field = key.replace(/_list$/, '').toLowerCase();
        const type = snakeToCamelCase(field) + 'Field';
        if (Array.isArray(value)) {
          value = record[key] = value.filter((item) => !!item);
          value.forEach((entry, index) => {
            entry.record_number = record.record_number;
            entry.order_number = index + 1;
            entry.record_field = field;
            entry.type_of = [type];
            entry.id = `${purl}#R${entry.record_number}-${type}-${entry.order_number}`;
          });
        } else if (typeof value === 'object') {
          value.record_number = record.record_number;
          value.record_field = field;
          value.type_of = [type];
          value.id = `${purl}#R${value.record_number}-${type}`;
        }
      }
      record.type_of = ['Record'];
      return record;
    });
  }

  to_json() {
    return {
      options: { ...this.options, csvString: undefined, csvData: undefined },
      errors: this.errors,
      warnings: Array.from(this.warnings),
      columns: this.columns,
      metadata: this.metadata,
      data: this.data,
    };
  }

  parse() {
    this.parseCsvData();
    this.parseHeader();
    this.parseMetadata();
    this.parseRows();

    return this.to_json();
  }
}
export function snakeToCamelCase(str) {
  return str
    .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
    .replace(/^[a-z]/, (match) => match.toUpperCase());
}

export function parseTable(csvString, options = {}) {
  if (!options.headerFirstColumnName) {
    throw new Error('headerFirstColumnName is a required option');
  }
  return new TableParser({ csvString, ...options }).parse();
}
