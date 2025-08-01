import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, loadGraph, queryGraph, shortenId } from './utils.js';

export function reconstructRefOrgan(context) {
  try {   
    loadGraph(context);
    queryGraph(context);
    transformRecords(context);

    info('Reference organ reconstruction completed successfully');
  } catch (err) {
    error('Error during reference organ reconstruction:', err);
    throw err;
  }
}


function transformRecords(context) {
  const doPath = resolve(context.selectedDigitalObject.path);
  const inputFilePath = resolve(doPath, 'reconstructed/records.csv');

  info('Reading CSV file...');
  const fileContent = readFileSync(inputFilePath, 'utf8');

  // Parse CSV content
  const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true
  });
  const dataRows = result.data;

  // Sort by record_order to ensure proper row positioning
  dataRows.sort((a, b) => {
    const orderA = parseInt(a['record_order'] || '0');
    const orderB = parseInt(b['record_order'] || '0');
    return orderA - orderB;
  });

  // Transform rows to CSV format
  const transformedRows = dataRows.map(row => {
    return {
      'node_name': row['node_name'] || '',
      'OntologyID': shortenId(row['ontology_id'] || ''),
      'label': row['label'] || ''
    };
  });

  // Define the column order based on the expected CSV structure
  const columnHeaders = ['node_name', 'OntologyID', 'label'];
  
  // Create CSV content without metadata using Papa.unparse
  const outputContent = Papa.unparse(transformedRows, {
    columns: columnHeaders,
    header: true,
    quotes: true
  });
  
  writeReconstructedData(context, outputContent, 'reconstructed.csv');
}