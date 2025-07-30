import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph, shortenId } from './utils.js';

export function reconstructOmap(context) {
  try {   
    loadGraph(context);
    queryGraph(context);
    transformRecords(context);

    info('OMAP reconstruction completed successfully');
  } catch (err) {
    error('Error during OMAP reconstruction:', err);
    throw err;
  }
}

function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const doPath = resolve(context.selectedDigitalObject.path);
    const journalPath = resolve(doPath, 'reconstructed/blazegraph.jnl');

    // Query records
    const recordsQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-omap-records.rq');
    const recordsOutputPath = resolve(doPath, 'reconstructed/records.csv');
    executeBlazegraphQuery(journalPath, recordsQueryPath, recordsOutputPath);
    
    // Query metadata
    const metadataQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-omap-metadata.rq');
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
  const metadataLines = metadataContent.trim().split(/\r?\n/);
  const metadataHeaders = metadataLines[0].split('\t');
  const metadataData = metadataLines[1].split('\t');
  
  const metadata = {};
  metadataHeaders.forEach((header, index) => {
    metadata[header] = metadataData[index] || '';
  });

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

  // Group records by record_number_str
  const recordGroups = {};
  dataRows.forEach(row => {
    const recordNumber = row['?record_number_str'];
    if (!recordGroups[recordNumber]) {
      recordGroups[recordNumber] = [];
    }
    recordGroups[recordNumber].push(row);
  });

  // Process each record group
  const transformedRows = [];
  const allColumns = new Set();

  Object.keys(recordGroups).forEach(recordNumber => {
    const group = recordGroups[recordNumber];
    
    // Process each row in the group (each antibody record)
    group.forEach(row => {
      const transformedRow = {};
      
      // Extract OMAP ID from experiment id
      const experimentIri = row['?experiment_str'] || '';
      const omapId = experimentIri.includes('#') ? experimentIri.split('#').pop() : experimentIri;
      transformedRow['omap_id'] = omapId;
      
      // Extract protein information - need to parse from detected_protein_id_str
      const detectedProteinId = row['?detected_protein_id_str'] || '';
      transformedRow['uniprot_accession_number'] = row['?uniprot_id_str'] || '';
      transformedRow['HGNC_ID'] = row['?detected_protein_id_str']?.replace('http://identifiers.org/hgnc/', 'HGNC:') || '';
      transformedRow['target_symbol'] = row['?detected_protein_label_str'] || '';
      // Antibody host information
      transformedRow['host'] = row['?host_str'] || '';
      transformedRow['isotype'] = row['?isotype_str'] || '';
      transformedRow['clonality'] = row['?clonality_str'] || '';
      transformedRow['clone_id'] = row['?clone_id_str'] || '';
      
      // Vendor information
      transformedRow['vendor'] = row['?antibody_manufacturer_str'] || '';
      transformedRow['catalog_number'] = row['?catalog_number_str'] || '';
      transformedRow['lot_number'] = row['?lot_number_str'] || '';
      
      // Recombinant status
      transformedRow['recombinant'] = row['?recombinant_str'] || '';
      
      // Concentration and dilution
      transformedRow['concentration_value'] = row['?concentration_str'] || '';
      transformedRow['dilution_factor'] = row['?dilution_str'] || '';
      
      // Conjugate information - need to determine from fluorescent reporter
      transformedRow['conjugate'] = row['?conjugate_str'] || '';
      
      // RRID from registered antibody
      const rrid = row['?antibody_str'] || '';
      transformedRow['rrid'] = rrid.replace('https://identifiers.org/RRID:', '') || '';
      
      // Method and preservation
      transformedRow['method'] = row['?study_method_str'] || '';
      transformedRow['tissue_preservation'] = row['?tissue_preservation_str'] || '';
      
      // Cycle information
      transformedRow['cycle_number'] = row['?cycle_number_str'] || '';
      transformedRow['fluorescent_reporter'] = '';
      
      // Protocol DOI
      transformedRow['protocol_doi'] = row['?protocol_doi_str'] || '';
      
      // Author ORCIDs - clean up the format
      const authorOrcids = row['?author_orcid_str'] || '';
      transformedRow['author_orcids'] = authorOrcids.replace(/http:\/\/purl\.org\/ccf\//g, '').replace(/,\s*/g, ', ');
      
      // Core panel status
      transformedRow['core_panel'] = row['?is_core_panel_str'] === 'true' ? 'Y' : 'N';
      
      // Rationale
      transformedRow['rationale'] = row['?rationale_str'] || '';
      
      // Organ information
      transformedRow['organ'] = row['?sample_organ_label_str'] || '';
      transformedRow['organ_uberon'] = row['?sample_organ_str']?.replace('http://purl.obolibrary.org/obo/UBERON_', 'UBERON:') || '';
      
      transformedRows.push(transformedRow);
      
      // Track all columns
      Object.keys(transformedRow).forEach(key => allColumns.add(key));
    });
  });

  // Define the column order based on the target OMAP CSV structure
  const newHeader = [
    'omap_id', 'uniprot_accession_number', 'HGNC_ID', 'target_symbol',
    'host', 'isotype', 'clonality', 'clone_id', 'vendor', 'catalog_number', 'lot_number',
    'recombinant', 'concentration_value', 'dilution_factor', 'conjugate', 'rrid',
    'method', 'tissue_preservation', 'cycle_number', 'fluorescent_reporter', 'protocol_doi',
    'author_orcids', 'core_panel', 'rationale', 'organ', 'organ_uberon'
  ];
  
  // Create metadata rows
  const metadataRows = [
    [metadata['?tableTitle'], '', '', '', '', '', '', '', ''], // First row with table title
    ['', '', '', '', '', '', '', '', ''], // Empty second row
    [`Author Name(s):`, metadata['?authorNames']],
    [`Author ORCID(s):`, metadata['?authorOrcids']],
    [`Reviewer(s):`, metadata['?reviewerNames']],
    [`Reviewer ORCID(s):`, metadata['?reviewerOrcids']],
    [`General Publication(s):`, metadata['?generalPublications']],
    [`Data DOI:`, metadata['?dataDoi']],
    [`Date:`, metadata['?date']],
    [`Version Number:`, metadata['?versionNumber']]
  ];

  // Combine metadata rows, headers, and data rows for Papa.unparse
  const allRows = [
    ...metadataRows,
    newHeader,
    ...transformedRows.map(row => newHeader.map(col => row[col] || ''))
  ];
  
  // Write output with metadata at the top using Papa.unparse
  const outputContent = Papa.unparse(allRows, {
    quotes: true
  });
  
  writeReconstructedData(context, outputContent, 'reconstructed.csv');
}