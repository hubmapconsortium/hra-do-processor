import { readFileSync } from 'fs';
import { resolve } from 'path';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph, shortenId, quoteIfNeeded } from './utils.js';

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
    const reconstructPath = resolve(context.reconstructionHome);
    const journalPath = resolve(reconstructPath, 'blazegraph.jnl');

    // Query records only (no metadata)
    const recordsQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-2d-ftu-records.rq');
    const recordsOutputPath = resolve(reconstructPath, 'records.tsv');
    executeBlazegraphQuery(journalPath, recordsQueryPath, recordsOutputPath);

    info('Graph query completed successfully');
  } catch (err) {
    error('Error during graph query:', err);
    throw err;
  }
}

function transformRecords(context) {
  const reconstructPath = resolve(context.reconstructionHome);
  const inputFilePath = resolve(reconstructPath, 'records.tsv');

  info('Reading TSV file...');
  const fileContent = readFileSync(inputFilePath, 'utf8');

  // Parse TSV content
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
      'node_label': quoteIfNeeded(row['?node_label_str'] || ''),
      'node_mapped_to': shortenId(row['?node_mapped_to_str'] || ''),
      'tissue_label': quoteIfNeeded(row['?tissue_label_str'] || ''),
      'tissue_mapped_to': shortenId(row['?tissue_mapped_to_str'] || ''),
      'organ_label': quoteIfNeeded(row['?organ_label_str'] || ''),
      'organ_mapped_to': shortenId(row['?organ_mapped_to_str'] || '')
    };
  });

  // Define the column order based on the query variables
  const columnHeaders = [
    'node_id', 'node_group', 'node_label', 'node_mapped_to',
    'tissue_label', 'tissue_mapped_to', 'organ_label', 'organ_mapped_to'
  ];
  
  // Create CSV content without metadata
  const csvDataRows = transformedRows.map(row => columnHeaders.map(col => `${row[col] || ''}`).join(','));
  const outputContent = [
    columnHeaders.join(','),
    ...csvDataRows
  ].join('\n');
  
  writeReconstructedData(context, outputContent, 'reconstructed.csv');
}