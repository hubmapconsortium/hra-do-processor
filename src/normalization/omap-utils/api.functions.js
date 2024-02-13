import Papa from 'papaparse';
import {
  OMAP_HEADER_FIRST_COLUMN,
} from './api.model.js';

export function makeOMAPData(csvData) {
  const rows = csvData.split(/\r?\n|\r|\n/g);
  const headerRow = findHeaderIndex(rows, OMAP_HEADER_FIRST_COLUMN);
  const cleanCsvData = rows.slice(headerRow).join('\n');
  return Papa.parse(cleanCsvData, { 
    skipEmptyLines: 'greedy', 
    header: true,
    dynamicTyping: true }).data;
}

function findHeaderIndex(rows, firstColumnName) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.startsWith(firstColumnName)) {
      return i;
    }
  }
  return 0;
}
