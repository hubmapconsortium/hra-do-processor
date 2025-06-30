import sh from 'shelljs';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { throwOnError } from '../utils/sh-exec.js';
import { info } from '../utils/logging.js';
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
  const reconstructPath = resolve(context.reconstructionHome);
  const graphTtl = resolve(reconstructPath, 'graph.ttl');
  const metadataTtl = resolve(reconstructPath, 'metadata.ttl');

  // Remove existing reconstruct path if it exists, then create fresh
  if (existsSync(reconstructPath)) {
    rmSync(reconstructPath, { recursive: true, force: true });
  }
  mkdirSync(reconstructPath, { recursive: true });

  sh.cp(resolve(obj.path, 'enriched/enriched.ttl'), graphTtl);
  sh.cp(resolve(obj.path, 'enriched/enriched-metadata.ttl'), metadataTtl);

  info(`Reifying "${obj.doString}"`);
  reifyDoTurtle(context, graphTtl);
  loadDoIntoTripleStore(context, resolve(context.reconstructionHome, 'blazegraph.jnl'));

  info(`Reifying "${obj.doString}" metadata`);
  reifyMetadataTurtle(context, metadataTtl);
  loadMetadataIntoTripleStore(context, resolve(context.reconstructionHome, 'blazegraph.jnl'));

  // Check if the enrichment produces redundant graph
  const redundant = resolve(obj.path, 'enriched/redundant.ttl');
  if (existsSync(redundant)) {
    const redundantReconstructPath = resolve(reconstructPath, 'redundant.ttl');
    sh.cp(redundant, redundantReconstructPath);
    reifyRedundantTurtle(context, redundantReconstructPath);
    loadRedundantIntoTripleStore(context, resolve(context.reconstructionHome, 'blazegraph.jnl'));
  }
}

export function executeBlazegraphQuery(journalPath, queryPath, outputPath) {
  const command = `blazegraph-runner select --journal=${journalPath} --outformat=tsv ${queryPath} ${outputPath}`;
  throwOnError(command, 'Error executing blazegraph query');
}

export function writeReconstructedData(context, data, outputFile) {
  const { path } = context.selectedDigitalObject;
  const reconstructedPath = resolve(path, 'reconstructed/', outputFile);
  writeFileSync(reconstructedPath, data, 'utf8');
  info(`Reconstructed digital object written to ${reconstructedPath}`);
}

export function cleanDirectory(context) {
  const { selectedDigitalObject: obj } = context;
  const path = resolve(obj.path, 'reconstructed/');
  throwOnError(
    `find ${path} -type f -exec rm -f {} +`,
    'Clean normalized directory failed.'
  );
}