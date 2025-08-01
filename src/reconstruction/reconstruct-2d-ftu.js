import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, loadGraph, queryGraph, shortenId } from './utils.js';

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

  // Transform rows to CSV format
  const transformedRows = dataRows.map(row => {
    return {
      'node_id': row['node_id'] || '',
      'node_group': row['node_group'] || '',
      'node_label': row['node_label'] || '',
      'node_mapped_to': shortenId(row['node_mapped_to'] || ''),
      'tissue_label': row['tissue_label'] || '',
      'tissue_mapped_to': shortenId(row['tissue_mapped_to'] || ''),
      'organ_label': row['organ_label'] || '',
      'organ_mapped_to': shortenId(row['organ_mapped_to'] || '')
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