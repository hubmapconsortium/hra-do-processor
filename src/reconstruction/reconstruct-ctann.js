import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph, shortenId, formatToMonthDDYYYY } from './utils.js';

export function reconstructCtann(context) {
  try {   
    loadGraph(context);
    queryGraph(context);
    transformRecords(context);

    info('CTAnn reconstruction completed successfully');
  } catch (err) {
    error('Error during CTAnn reconstruction:', err);
    throw err;
  }
}

function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const doPath = resolve(context.selectedDigitalObject.path);
    const journalPath = resolve(doPath, 'reconstructed/blazegraph.jnl');

    // Query records
    const recordsQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-ctann-records.rq');
    const recordsOutputPath = resolve(doPath, 'reconstructed/records.csv');
    executeBlazegraphQuery(journalPath, recordsQueryPath, recordsOutputPath);
    
    // Query metadata
    const metadataQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-ctann-metadata.rq');
    const metadataOutputPath = resolve(doPath, 'reconstructed/metadata.csv');
    executeBlazegraphQuery(journalPath, metadataQueryPath, metadataOutputPath);

    info('Graph query completed successfully');
  } catch (err) {
    error('Error during graph query:', err);
    throw err;
  }
}

function transformRecords(context) {
  const doPath = resolve(context.selectedDigitalObject.path);
  const inputFilePath = resolve(doPath, 'reconstructed/records.csv');
  const metadataFilePath = resolve(doPath, 'reconstructed/metadata.csv');

  info('Reading CSV file...');
  const fileContent = readFileSync(inputFilePath, 'utf8');

  // Read and parse metadata
  info('Reading metadata file...');
  const metadataContent = readFileSync(metadataFilePath, 'utf8');
  const metadataResult = Papa.parse(metadataContent, {
    header: true,
    skipEmptyLines: true
  });
  const metadata = metadataResult.data[0];

  // Parse CSV content
  const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true
  });
  const dataRows = result.data;

  // Transform rows to CSV format
  const transformedRows = dataRows.map(row => {
    return {
      'Organ_Level': row['Organ_Level'] || '',
      'Organ_ID': shortenId(row['Organ_ID'] || ''),
      'Annotation_Label': row['Annotation_Label'] || '',
      'Annotation_Label_ID': row['Annotation_Label_ID'] || '',
      'CL_Label': row['CL_Label'] || '',
      'CL_ID': shortenId(row['CL_ID'] || ''),
      'CL_Match': shortenId(row['CL_Match'] || '')
    };
  });

  // Define the column order based on the target CTAnn CSV structure
  const columnHeaders = [
    'Organ_Level', 'Organ_ID', 'Annotation_Label', 'Annotation_Label_ID',
    'CL_Label', 'CL_ID', 'CL_Match'
  ];
  
  // Create metadata rows matching azimuth-crosswalk.csv format
  const metadataRows = [
    [metadata['tableTitle'], '', '', '', '', '', ''], // First row with table title
    ['', '', '', '', '', '', ''], // Empty second row
    [`Author Name(s):`, metadata['authorNames']],
    [`Author ORCID(s):`, `"${metadata['authorOrcids']?.replace(/;\s*/g, ', ')}"`],
    [`Reviewer(s):`, `"${metadata['reviewerNames']?.replace(/;\s*/g, ', ')}"`],
    [`Reviewer ORCID(s):`, `"${metadata['reviewerOrcids']?.replace(/;\s*/g, ', ')}"`],
    [`General Publication(s):`, metadata['generalPublications']],
    [`Data DOI:`, metadata['dataDoi']],
    [`Date:`, formatToMonthDDYYYY(metadata['date'])],
    [`Version number:`, metadata['versionNumber']]
  ];

  // Combine metadata rows, headers, and data rows for Papa.unparse
  const allRows = [
    ...metadataRows,
    columnHeaders,
    ...transformedRows.map(row => columnHeaders.map(col => row[col] || ''))
  ];
  
  // Write output with metadata at the top using Papa.unparse
  const outputContent = Papa.unparse(allRows, {
    quotes: true
  });
  
  writeReconstructedData(context, outputContent, 'reconstructed.csv');
}