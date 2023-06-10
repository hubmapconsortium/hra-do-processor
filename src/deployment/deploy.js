import { existsSync } from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { readMetadata } from '../normalization/utils.js';
import { loadDoIntoTripleStore, loadRedundantIntoTripleStore } from './utils.js';
import { reifyDoTurtle, reifyRedundantTurtle } from '../utils/reify.js';
import { info } from '../utils/logging.js';

export function deploy(context) {
  const obj = context.selectedDigitalObject;
  const deployPath = resolve(context.deploymentHome, obj.doString);
  const metadata = readMetadata(context);
  const datasetPath = resolve(deployPath, 'dataset.ttl');

  sh.mkdir('-p', resolve(deployPath, 'assets'));
  sh.cp(resolve(obj.path, 'packaged/*'), deployPath);
  sh.cp(resolve(obj.path, 'enriched/enriched.ttl'), datasetPath);

  for (const file of metadata.datatable) {
    sh.cp(resolve(obj.path, 'raw', file), resolve(deployPath, 'assets', file));
  }

  const tripleStore = resolve(context.deploymentHome, 'blazegraph.jnl');

  info(`Loading "${obj.iri}" graph to triple store...`);
  loadDoIntoTripleStore(context, tripleStore);
  reifyDoTurtle(context, datasetPath, tripleStore);

  // Check if the enrichment produces redundant graph
  const redundant = resolve(obj.path, 'enriched/redundant.ttl')
  if (existsSync(redundant)) {
    info(`Loading "${obj.iri}/redundant" graph to triple store...`);
    loadRedundantIntoTripleStore(context, tripleStore);

    const redundantDeployPath = resolve(deployPath, 'redundant.ttl');
    sh.cp(redundant, redundantDeployPath);
    reifyRedundantTurtle(context, redundantDeployPath, tripleStore);
  }
}