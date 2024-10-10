import { existsSync } from 'fs';
import { dirname, resolve } from 'path';
import sh from 'shelljs';
import { readMetadata } from '../normalization/utils.js';
import { info } from '../utils/logging.js';
import { reifyDoTurtle, reifyMetadataTurtle, reifyRedundantTurtle } from '../utils/reify.js';
import { loadDoIntoTripleStore, loadRedundantIntoTripleStore, removeIndividuals } from './utils.js';

export function deploy(context) {
  const obj = context.selectedDigitalObject;
  const deployPath = resolve(context.deploymentHome, obj.doString);
  const metadata = readMetadata(context);
  const graph = resolve(deployPath, 'graph.ttl');
  const metadataTtl = resolve(deployPath, 'metadata.ttl');

  sh.mkdir('-p', resolve(deployPath, 'assets'));
  sh.cp(resolve(obj.path, 'enriched/enriched.ttl'), graph);
  sh.cp(resolve(obj.path, 'enriched/enriched-metadata.ttl'), metadataTtl);

  for (const file of metadata.datatable) {
    if (file.includes('/')) {
      sh.mkdir('-p', resolve(deployPath, 'assets', dirname(file)));
    }
    sh.cp(resolve(obj.path, 'raw', file), resolve(deployPath, 'assets', file));
  }

  if (context.removeIndividuals) {
    info("Removing OWL individuals from the graph output.");
    removeIndividuals(graph, graph);
  }
  
  info(`Reifying "${obj.doString}"`);
  reifyDoTurtle(context, graph);
  if (context.updateDb) {
    loadDoIntoTripleStore(context, resolve(context.deploymentHome, 'blazegraph.jnl'));
  }

  info(`Reifying "${obj.doString}" metadata`);
  reifyMetadataTurtle(context, metadataTtl);

  // Check if the enrichment produces redundant graph
  const redundant = resolve(obj.path, 'enriched/redundant.ttl');
  if (existsSync(redundant)) {
    const redundantDeployPath = resolve(deployPath, 'redundant.ttl');
    sh.cp(redundant, redundantDeployPath);
    reifyRedundantTurtle(context, redundantDeployPath);

    if (context.updateDb) {
      loadRedundantIntoTripleStore(context, resolve(context.deploymentHome, 'blazegraph.jnl'));
    }
  }
}
