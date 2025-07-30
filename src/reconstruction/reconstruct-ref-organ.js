import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph, shortenId } from './utils.js';

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

function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const doPath = resolve(context.selectedDigitalObject.path);
    const journalPath = resolve(doPath, 'reconstructed/blazegraph.jnl');

    // Query records only (no metadata)
    const recordsQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-ref-organ-records.rq');
    const recordsOutputPath = resolve(doPath, 'reconstructed/records.csv');
    executeBlazegraphQuery(journalPath, recordsQueryPath, recordsOutputPath);

    info('Graph query completed successfully');
  } catch (err) {
    error('Error during graph query:', err);
    throw err;
  }
}

function transformRecords(context) {
  const doPath = resolve(context.selectedDigitalObject.path);
  const inputFilePath = resolve(doPath, 'reconstructed/records.csv');

  info('Reading CSV file...');
  const fileContent = readFileSync(inputFilePath, 'utf8');

  // Parse CSV content
  const lines = fileContent.trim().split(/\r?\n/); // Handle both \r\n and \n line endings
  const headers = lines[0].split('\t');
  const dataRows = lines.slice(1).map(line => {
    const values = line.split('\t');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  // Sort by record_order to ensure proper row positioning
  dataRows.sort((a, b) => {
    const orderA = parseInt(a['?record_order_str'] || '0');
    const orderB = parseInt(b['?record_order_str'] || '0');
    return orderA - orderB;
  });

  // Transform rows to CSV format
  const transformedRows = dataRows.map(row => {
    return {
      'node_name': row['?node_name_str'] || '',
      'OntologyID': shortenId(row['?ontology_id_str'] || ''),
      'label': row['?label_str'] || ''
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