import { readFileSync } from 'fs';
import { resolve } from 'path';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph } from './utils.js';

export function reconstructCollection(context) {
  try {   
    loadGraph(context);
    queryGraph(context);
    transformRecords(context);

    info('Collection reconstruction completed successfully');
  } catch (err) {
    error('Error during Collection reconstruction:', err);
    throw err;
  }
}

function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const doPath = resolve(context.selectedDigitalObject.path);
    const journalPath = resolve(doPath, 'reconstructed/blazegraph.jnl');

    // Query records only (no metadata)
    const recordsQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-collection-records.rq');
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
  const lines = fileContent.trim().split(/\r?\n/);
  const headers = lines[0].split('\t');
  const dataRows = lines.slice(1).map(line => {
    const values = line.split('\t');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  // Transform sub_graph URLs to abbreviated format
  const digitalObjects = dataRows.map(row => {
    const subGraphStr = row['?sub_graph_str'] || '';
    return abbreviateSubGraph(subGraphStr);
  }).filter(item => item !== '') // Remove empty items
    .sort(); // Sort alphabetically

  // Create YAML output
  const yamlContent = `digital-objects:\n${digitalObjects.map(item => `  - ${item}`).join('\n')}`;
  
  writeReconstructedData(context, yamlContent, 'reconstructed.yaml');
}

function abbreviateSubGraph(subGraphStr) {
  // Extract the meaningful part from the sub_graph URL
  
  if (!subGraphStr) return '';
  
  // Look for patterns that match the expected output format
  // This assumes the URL contains the relevant path information
  const match = subGraphStr.match(/([^\/]+\/[^\/]+\/v\d+\.\d+)$/);
  if (match) {
    return match[1];
  }
  
  // Fallback: extract last meaningful segments if the pattern doesn't match exactly
  const segments = subGraphStr.split('/').filter(seg => seg && seg !== 'http:' && seg !== 'https:');
  if (segments.length >= 3) {
    // Take the last 3 segments which should be type/name/version
    return segments.slice(-3).join('/');
  }
  
  return subGraphStr;
}