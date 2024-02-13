import Papa from 'papaparse';
import { ALL_OMAP_HEADER_FIRST_COLUMNS } from './api.model.js';

export function makeOMAPData(csvData) {
  const rows = csvData.split(/\r?\n|\r|\n/g);
  const headerRow = findHeaderIndex(rows, ALL_OMAP_HEADER_FIRST_COLUMNS);
  // Ignore all data from older, deprecated OMAP formats
  if (headerRow === -1 || !rows[headerRow].includes('organ_uberon')) {
    return [];
  } else {
    const cleanCsvData = rows.slice(headerRow).join('\n');
    return Papa.parse(cleanCsvData, {
      skipEmptyLines: 'greedy',
      header: true,
      dynamicTyping: true,
    }).data;
  }
}

function findHeaderIndex(rows, columns = new Set()) {
  for (let i = 0; i < rows.length; i++) {
    const col = rows[i].split(',', 1)[0];
    if (columns.has(col)) {
      return i;
    }
  }
  return -1;
}
