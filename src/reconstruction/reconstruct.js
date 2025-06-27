import { existsSync, mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { info } from '../utils/logging.js';
import { reifyDoTurtle, reifyMetadataTurtle, reifyRedundantTurtle } from '../utils/reify.js';
import { loadDoIntoTripleStore, loadRedundantIntoTripleStore } from '../deployment/utils.js';

export function reconstruct(context) {
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

  // Check if the enrichment produces redundant graph
  const redundant = resolve(obj.path, 'enriched/redundant.ttl');
  if (existsSync(redundant)) {
    const redundantReconstructPath = resolve(reconstructPath, 'redundant.ttl');
    sh.cp(redundant, redundantReconstructPath);
    reifyRedundantTurtle(context, redundantReconstructPath);
    loadRedundantIntoTripleStore(context, resolve(context.reconstructionHome, 'blazegraph.jnl'));
  }
}
