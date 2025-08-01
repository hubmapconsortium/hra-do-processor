import sh from 'shelljs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { throwOnError } from '../utils/sh-exec.js';
import { info, error } from '../utils/logging.js';
import { reifyDoTurtle, reifyMetadataTurtle, reifyRedundantTurtle } from '../utils/reify.js';
import { loadDoIntoTripleStore, loadMetadataIntoTripleStore, loadRedundantIntoTripleStore } from '../deployment/utils.js';


// Prefix definitions for shortening URIs
const PREFIX_MAPPINGS = {
  'http://purl.obolibrary.org/obo/UBERON_': 'UBERON:',
  'http://purl.obolibrary.org/obo/CL_': 'CL:',
  'http://purl.obolibrary.org/obo/PCL_': 'PCL:',
  'http://purl.obolibrary.org/obo/LMHA_': 'LMHA:',
  'http://purl.org/sig/ont/fma/fma': 'FMA:',
  'http://identifiers.org/hgnc/': 'HGNC:'
};

export function shortenId(uri) {
  if (!uri || typeof uri !== 'string') {
    return uri;
  }

  // Check each prefix mapping
  for (const [fullPrefix, shortPrefix] of Object.entries(PREFIX_MAPPINGS)) {
    if (uri.startsWith(fullPrefix)) {
      return uri.replace(fullPrefix, shortPrefix);
    }
  }

  // Return original URI if no prefix matches
  return uri;
}

export function loadGraph(context) {
  const obj = context.selectedDigitalObject;
  const doPath = resolve(obj.path);
  const graphTtl = resolve(doPath, 'reconstructed/graph.ttl');
  const metadataTtl = resolve(doPath, 'reconstructed/metadata.ttl');

  sh.cp(resolve(obj.path, 'enriched/enriched.ttl'), graphTtl);
  sh.cp(resolve(obj.path, 'enriched/enriched-metadata.ttl'), metadataTtl);

  info(`Reifying "${obj.doString}"`);
  reifyDoTurtle(context, graphTtl);
  loadDoIntoTripleStore(context, resolve(doPath, 'reconstructed/blazegraph.jnl'));

  info(`Reifying "${obj.doString}" metadata`);
  reifyMetadataTurtle(context, metadataTtl);
  loadMetadataIntoTripleStore(context, resolve(doPath, 'reconstructed/blazegraph.jnl'));

  // Check if the enrichment produces redundant graph
  const redundant = resolve(obj.path, 'enriched/redundant.ttl');
  if (existsSync(redundant)) {
    const redundantReconstructPath = resolve(doPath, 'reconstructed/redundant.ttl');
    sh.cp(redundant, redundantReconstructPath);
    reifyRedundantTurtle(context, redundantReconstructPath);
    loadRedundantIntoTripleStore(context, resolve(doPath, 'reconstructed/blazegraph.jnl'));
  }
}

export function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const doPath = resolve(context.selectedDigitalObject.path);
    const journalPath = resolve(doPath, 'reconstructed/blazegraph.jnl');
    const type = context.selectedDigitalObject.type;

    // Always query records
    const recordsQueryPath = resolve(processorHome, `src/reconstruction/queries/get-${type}-records.rq`);
    const recordsOutputPath = resolve(doPath, 'reconstructed/records.csv');
    executeBlazegraphQuery(journalPath, recordsQueryPath, recordsOutputPath);
    
    // Auto-detect and query metadata if file exists
    const metadataQueryPath = resolve(processorHome, `src/reconstruction/queries/get-${type}-metadata.rq`);
    if (existsSync(metadataQueryPath)) {
      const metadataOutputPath = resolve(doPath, 'reconstructed/metadata.csv');
      executeBlazegraphQuery(journalPath, metadataQueryPath, metadataOutputPath);
    }

    info('Graph query completed successfully');
  } catch (err) {
    error('Error during graph query:', err);
    throw err;
  }
}

export function executeBlazegraphQuery(journalPath, queryPath, outputPath) {
  const jsonOutputPath = outputPath.replace(/\.csv$/, '.json');
  const blazegraphCommand = `blazegraph-runner select --journal=${journalPath} --outformat=json ${queryPath} ${jsonOutputPath}`;
  const json2csvCommand = `node src/reconstruction/json2csv.js ${jsonOutputPath} ${outputPath}`;
  
  throwOnError(blazegraphCommand, 'Error executing blazegraph query');
  throwOnError(json2csvCommand, 'Error converting JSON to CSV');
}

export function writeReconstructedData(context, data, outputFile) {
  const { path } = context.selectedDigitalObject;
  const reconstructedPath = resolve(path, 'reconstructed/', outputFile);
  writeFileSync(reconstructedPath, data, 'utf8');
  info(`Reconstructed digital object written to ${reconstructedPath}`);
  
  // Clean up intermediate files after writing the final CSV
  cleanDirectory(context);
}

export function cleanDirectory(context) {
  // Skip cleanup if --keep-artifacts flag is set
  if (context.keepArtifacts) {
    return;
  }
  
  const { selectedDigitalObject: obj } = context;
  const path = resolve(obj.path, 'reconstructed/');
  
  // Remove all files except reconstructed.csv or reconstructed.yml
  throwOnError(
    `find ${path} -type f ! -name "reconstructed.csv" ! -name "reconstructed.yaml" -exec rm -f {} +`,
    'Clean reconstruction directory failed.'
  );
}

// Format date from YYYY-MM-DD to quoted "Month DD, YYYY"
export function formatToMonthDDYYYY(dateStr) {
  if (!dateStr || dateStr === '') return '';
  try {
    // Parse date string directly to avoid timezone issues
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[parseInt(month, 10) - 1];
      return `"${monthName} ${parseInt(day, 10)}, ${year}"`;
    }
    return `"${dateStr}"`;
  } catch (e) {
    return `"${dateStr}"`;
  }
}

