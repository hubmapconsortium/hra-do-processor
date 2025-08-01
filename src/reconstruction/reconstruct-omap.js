import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, loadGraph, queryGraph, formatToMonthDDYYYY } from './utils.js';

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

  // Group records by record_number
  const recordGroups = {};
  dataRows.forEach(row => {
    const recordNumber = row['record_number'];
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
      const experimentIri = row['experiment'] || '';
      const omapId = experimentIri.includes('#') ? experimentIri.split('#').pop() : experimentIri;
      transformedRow['omap_id'] = omapId;
      
      // Extract protein information - need to parse from detected_protein_id_str
      const detectedProteinId = row['detected_protein_id_str'] || '';
      transformedRow['uniprot_accession_number'] = row['uniprot_id_str'] || '';
      transformedRow['HGNC_ID'] = row['detected_protein_id_str']?.replace('http://identifiers.org/hgnc/', 'HGNC:') || '';
      transformedRow['target_symbol'] = row['detected_protein_label_str'] || '';
      // Antibody host information
      transformedRow['host'] = row['host'] || '';
      transformedRow['isotype'] = row['isotype'] || '';
      transformedRow['clonality'] = row['clonality'] || '';
      transformedRow['clone_id'] = row['clone_id'] || '';
      
      // Vendor information
      transformedRow['vendor'] = row['antibody_manufacturer'] || '';
      transformedRow['catalog_number'] = row['catalog_number'] || '';
      transformedRow['lot_number'] = row['lot_number'] || '';
      
      // Recombinant status
      transformedRow['recombinant'] = row['recombinant'] || '';
      
      // Concentration and dilution
      transformedRow['concentration_value'] = row['concentration'] || '';
      transformedRow['dilution_factor'] = row['dilution'] || '';
      
      // Conjugate information - need to determine from fluorescent reporter
      transformedRow['conjugate'] = row['conjugate'] || '';
      
      // RRID from registered antibody
      const rrid = row['antibody'] || '';
      transformedRow['rrid'] = rrid.replace('https://identifiers.org/RRID:', '') || '';
      
      // Method and preservation
      transformedRow['method'] = row['study_method'] || '';
      transformedRow['tissue_preservation'] = row['tissue_preservation'] || '';
      
      // Cycle information
      transformedRow['cycle_number'] = row['cycle_number'] || '';
      transformedRow['fluorescent_reporter'] = '';
      
      // Protocol DOI
      transformedRow['protocol_doi'] = row['protocol_doi_str'] || '';
      
      // Author ORCIDs - clean up the format
      const authorOrcids = row['author_orcid_str'] || '';
      transformedRow['author_orcids'] = authorOrcids.replace(/http:\/\/purl\.org\/ccf\//g, '').replace(/,\s*/g, ', ');
      
      // Core panel status
      transformedRow['core_panel'] = row['is_core_panel'] === 'true' ? 'Y' : 'N';
      
      // Rationale
      transformedRow['rationale'] = row['rationale'] || '';
      
      // Organ information
      transformedRow['organ'] = row['sample_organ_label'] || '';
      transformedRow['organ_uberon'] = row['sample_organ']?.replace('http://purl.obolibrary.org/obo/UBERON_', 'UBERON:') || '';
      
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
    [metadata['tableTitle'], '', '', '', '', '', '', '', ''], // First row with table title
    ['', '', '', '', '', '', '', '', ''], // Empty second row
    [`Author Name(s):`, metadata['authorNames']],
    [`Author ORCID(s):`, metadata['authorOrcids']],
    [`Reviewer(s):`, metadata['reviewerNames']],
    [`Reviewer ORCID(s):`, metadata['reviewerOrcids']],
    [`General Publication(s):`, metadata['generalPublications']],
    [`Data DOI:`, metadata['dataDoi']],
    [`Date:`, formatToMonthDDYYYY(metadata['date'])],
    [`Version Number:`, metadata['versionNumber']]
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