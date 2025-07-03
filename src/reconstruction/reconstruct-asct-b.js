import { readFileSync } from 'fs';
import { resolve } from 'path';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph, shortenId } from './utils.js';

export function reconstructAsctb(context) {
  try {   
    loadGraph(context);
    queryGraph(context);
    transformRecords(context);

    info('ASCT-B reconstruction completed successfully');
  } catch (err) {
    error('Error during ASCT-B reconstruction:', err);
    throw err;
  }
}

function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const reconstructPath = resolve(context.reconstructionHome);
    const journalPath = resolve(reconstructPath, 'blazegraph.jnl');

    // Query records
    const recordsQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-asct-b-records.rq');
    const recordsOutputPath = resolve(reconstructPath, 'records.tsv');
    executeBlazegraphQuery(journalPath, recordsQueryPath, recordsOutputPath);
    
    // Query metadata
    const metadataQueryPath = resolve(processorHome, 'src/reconstruction/queries/get-asct-b-metadata.rq');
    const metadataOutputPath = resolve(reconstructPath, 'metadata.tsv');
    executeBlazegraphQuery(journalPath, metadataQueryPath, metadataOutputPath);

    info('Graph query completed successfully');
  } catch (err) {
    error('Error during graph query:', err);
    throw err;
  }
}

function transformRecords(context) {
  const reconstructPath = resolve(context.reconstructionHome);
  const inputFilePath = resolve(reconstructPath, 'records.tsv');
  const metadataFilePath = resolve(reconstructPath, 'metadata.tsv');

  info('Reading TSV file...');
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
    const transformedRow = {};

    // Process anatomical structures (as_)
    const asEntries = group.reduce((acc, row) => {
      const asRecordNumber = row['?as_record_number_str'];
      const asOrderNumber = row['?as_order_number_str'];
      const key = `${asRecordNumber}-${asOrderNumber}`;
      
      if (!acc[key]) {
        acc[key] = {
          recordNumber: asRecordNumber,
          orderNumber: asOrderNumber,
          prefLabel: row['?as_pref_label_str'],
          sourceConcept: row['?as_source_concept_str'],
          conceptLabel: row['?as_concept_label_str']
        };
      }
      return acc;
    }, {});

    Object.values(asEntries).forEach(entry => {
      const columnPrefix = `AS/${entry.orderNumber}`;
      transformedRow[columnPrefix] = entry.prefLabel;
      transformedRow[`${columnPrefix}/LABEL`] = entry.conceptLabel;
      transformedRow[`${columnPrefix}/ID`] = shortenId(entry.sourceConcept);
      
      allColumns.add(columnPrefix);
      allColumns.add(`${columnPrefix}/LABEL`);
      allColumns.add(`${columnPrefix}/ID`);
    });

    // Process cell types (ct_)
    const ctEntries = group.reduce((acc, row) => {
      const ctRecordNumber = row['?ct_record_number_str'];
      const ctOrderNumber = row['?ct_order_number_str'];
      const key = `${ctRecordNumber}-${ctOrderNumber}`;
      
      if (!acc[key]) {
        acc[key] = {
          recordNumber: ctRecordNumber,
          orderNumber: ctOrderNumber,
          prefLabel: row['?ct_pref_label_str'],
          sourceConcept: row['?ct_source_concept_str'],
          conceptLabel: row['?ct_concept_label_str']
        };
      }
      return acc;
    }, {});

    Object.values(ctEntries).forEach(entry => {
      const columnPrefix = `CT/${entry.orderNumber}`;
      transformedRow[columnPrefix] = entry.prefLabel;
      transformedRow[`${columnPrefix}/LABEL`] = entry.conceptLabel;
      transformedRow[`${columnPrefix}/ID`] = shortenId(entry.sourceConcept);
      
      allColumns.add(columnPrefix);
      allColumns.add(`${columnPrefix}/LABEL`);
      allColumns.add(`${columnPrefix}/ID`);
    });

    // Process biomarkers (bm_)
    const bmEntries = group.reduce((acc, row) => {
      const bmRecordNumber = row['?bm_record_number_str'];
      const bmOrderNumber = row['?bm_order_number_str'];
      const biomarkerType = row['?bm_biomarker_type_str'];
      const key = `${bmRecordNumber}-${bmOrderNumber}`;
      
      if (!acc[key]) {
        acc[key] = {
          recordNumber: bmRecordNumber,
          orderNumber: bmOrderNumber,
          biomarkerType: biomarkerType,
          prefLabel: row['?bm_pref_label_str'],
          sourceConcept: row['?bm_source_concept_str'],
          conceptLabel: row['?bm_concept_label_str']
        };
      }
      return acc;
    }, {});

    Object.values(bmEntries).forEach(entry => {
      // Skip if biomarkerType is empty
      if (!entry.biomarkerType) {
        return;
      }
      // Map biomarker type to prefix
      let bmPrefix;
      switch (entry.biomarkerType) {
        case 'gene':
          bmPrefix = 'BGene';
          break;
        case 'protein':
          bmPrefix = 'BProtein';
          break;
        case 'lipids':
          bmPrefix = 'BLipid';
          break;
        case 'metabolites':
          bmPrefix = 'BMetabolite';
          break;
        case 'proteoforms':
          bmPrefix = 'BProteoform';
          break;
      }

      const columnPrefix = `${bmPrefix}/${entry.orderNumber}`;
      transformedRow[columnPrefix] = entry.prefLabel;
      transformedRow[`${columnPrefix}/LABEL`] = entry.conceptLabel;
      transformedRow[`${columnPrefix}/ID`] = shortenId(entry.sourceConcept);
      
      allColumns.add(columnPrefix);
      allColumns.add(`${columnPrefix}/LABEL`);
      allColumns.add(`${columnPrefix}/ID`);
    });

    // Process references (ref_)
    const refEntries = group.reduce((acc, row) => {
      const refRecordNumber = row['?ref_record_number_str'];
      const refOrderNumber = row['?ref_order_number_str'];
      if (!refRecordNumber || !refOrderNumber) {
        return acc;
      }

      const key = `${refRecordNumber}-${refOrderNumber}`;

      if (!acc[key]) {
        acc[key] = {
          recordNumber: refRecordNumber,
          orderNumber: refOrderNumber,
          doi: row['?ref_doi_str'],
          external_id: row['?ref_external_id_str'],
        };
      }
      return acc;
    }, {});

    Object.values(refEntries).forEach(entry => {
      const columnPrefix = `REF/${entry.orderNumber}`;
      transformedRow[columnPrefix] = entry.external_id;
      transformedRow[`${columnPrefix}/ID`] = entry.doi;
      
      allColumns.add(columnPrefix);
      allColumns.add(`${columnPrefix}/ID`);
    });

    // Ensure at least one REF column exists
    if (Object.keys(refEntries).length === 0) {
      allColumns.add('REF/1');
      allColumns.add('REF/1/ID');
    }

    transformedRows.push(transformedRow);
  });

  // Create column headers in the specified order: AS, CT, BM, REF
  const columnOrder = ['AS', 'CT', 'BGene', 'BProtein', 'BLipid', 'BMetabolite', 'BProteoform', 'REF'];
  
  const newHeader = Array.from(allColumns).sort((a, b) => {
    // Get the prefix of each column (e.g., "AS/1" -> "AS", "CT/2/LABEL" -> "CT")
    const getPrefix = (col) => {
      const parts = col.split('/');
      return parts[0];
    };
    
    // Get the base column name (e.g., "AS/1/LABEL" -> "AS/1", "CT/2/ID" -> "CT/2")
    const getBaseColumn = (col) => {
      const parts = col.split('/');
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
      return col;
    };
    
    // Get the suffix type (e.g., "AS/1/LABEL" -> "LABEL", "CT/2/ID" -> "ID", "AS/1" -> "")
    const getSuffixType = (col) => {
      const parts = col.split('/');
      if (parts.length >= 3) {
        return parts[2];
      }
      return '';
    };
    
    const prefixA = getPrefix(a);
    const prefixB = getPrefix(b);
    
    // Find the order of each prefix in our desired order
    const orderA = columnOrder.indexOf(prefixA);
    const orderB = columnOrder.indexOf(prefixB);
    
    // If both prefixes are in our order list, sort by their position
    if (orderA !== -1 && orderB !== -1) {
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // If same prefix, sort by base column first, then by suffix type
      const baseColumnA = getBaseColumn(a);
      const baseColumnB = getBaseColumn(b);
      
      if (baseColumnA !== baseColumnB) {
        return baseColumnA.localeCompare(baseColumnB);
      }
      
      // If same base column, sort by suffix type: base column first, then LABEL, then ID
      const suffixA = getSuffixType(a);
      const suffixB = getSuffixType(b);
      
      const suffixOrder = { '': 0, 'LABEL': 1, 'ID': 2 };
      const suffixOrderA = suffixOrder[suffixA] ?? 3;
      const suffixOrderB = suffixOrder[suffixB] ?? 3;
      
      return suffixOrderA - suffixOrderB;
    }
    
    // If only one is in our order list, prioritize it
    if (orderA !== -1 && orderB === -1) return -1;
    if (orderA === -1 && orderB !== -1) return 1;
    
    // If neither is in our order list, sort alphabetically
    return a.localeCompare(b);
  });

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

  // Write output with metadata at the top
  const csvDataRows = transformedRows.map(row => newHeader.map(col => `"${row[col] || ''}"`).join(','));
  const outputContent = [
    ...metadataRows.map(row => row.map(cell => `"${cell}"`).join(',')),
    newHeader.map(col => `"${col}"`).join(','),
    ...csvDataRows
  ].join('\n');
  
  writeReconstructedData(context, outputContent, 'reconstructed.csv');
}
