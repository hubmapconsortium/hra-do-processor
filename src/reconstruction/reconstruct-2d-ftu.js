import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph, shortenId } from './utils.js';

export function reconstruct2dFtu(context) {
  try {   
    loadGraph(context);
    queryGraph(context);
    transformRecords(context);

    info('2D FTU reconstruction completed successfully');
  } catch (err) {
    error('Error during 2D FTU reconstruction:', err);
    throw err;
  }
}

function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const doPath = resolve(context.selectedDigitalObject.path);
    const journalPath = resolve(doPath, 'reconstructed/blazegraph.jnl');

    // Query records only (no metadata)
    const recordsQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-2d-ftu-records.rq');
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

  // Transform rows to CSV format
  const transformedRows = dataRows.map(row => {
    return {
      'node_id': row['?node_id_str'] || '',
      'node_group': row['?node_group_str'] || '',
      'node_label': row['?node_label_str'] || '',
      'node_mapped_to': shortenId(row['?node_mapped_to_str'] || ''),
      'tissue_label': row['?tissue_label_str'] || '',
      'tissue_mapped_to': shortenId(row['?tissue_mapped_to_str'] || ''),
      'organ_label': row['?organ_label_str'] || '',
      'organ_mapped_to': shortenId(row['?organ_mapped_to_str'] || '')
    };
  });

  // Define the column order based on the query variables
  const columnHeaders = [
    'node_id', 'node_group', 'node_label', 'node_mapped_to',
    'tissue_label', 'tissue_mapped_to', 'organ_label', 'organ_mapped_to'
  ];
  
  // Create CSV content without metadata using Papa.unparse
  const outputContent = Papa.unparse(transformedRows, {
    columns: columnHeaders,
    header: true,
    quotes: true
  });
  
  writeReconstructedData(context, outputContent, 'reconstructed.csv');
}