import { readFileSync } from 'fs';
import { resolve } from 'path';
import { info, error } from '../utils/logging.js';
import { writeReconstructedData, executeBlazegraphQuery, loadGraph } from './utils.js';

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
    const queryPath = resolve(processorHome, 'src/reconstruction/queries/get-asct-b-records.rq');
    const outputPath = resolve(reconstructPath, 'records.tsv');

    executeBlazegraphQuery(journalPath, queryPath, outputPath);
    
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
  const lines = fileContent.trim().split('\n');
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
      transformedRow[`${columnPrefix}/ID`] = entry.sourceConcept;
      
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
      transformedRow[`${columnPrefix}/ID`] = entry.sourceConcept;
      
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
      transformedRow[`${columnPrefix}/ID`] = entry.sourceConcept;
      
      allColumns.add(columnPrefix);
      allColumns.add(`${columnPrefix}/LABEL`);
      allColumns.add(`${columnPrefix}/ID`);
    });

    // Process references (record_references_str)
    const references = group[0]['?record_references_str'];
    if (references && references.trim()) {
      const refList = references.split(',').map(ref => ref.trim()).filter(ref => ref);
      refList.forEach((ref, index) => {
        const refNumber = index + 1;
        const columnPrefix = `REF/${refNumber}`;
        transformedRow[columnPrefix] = ref;
        transformedRow[`${columnPrefix}/ID`] = ref; // Using the same value for ID as specified
        
        allColumns.add(columnPrefix);
        allColumns.add(`${columnPrefix}/ID`);
      });
    }

    transformedRows.push(transformedRow);
  });

  // Create sorted column headers
  const newHeader = Array.from(allColumns).sort();

  // Write output
  const outputContent = [newHeader.join(','), ...transformedRows.map(row => newHeader.map(col => row[col] || '').join(','))].join('\n');
  writeReconstructedData(context, outputContent, 'reconstructed.csv');
}
