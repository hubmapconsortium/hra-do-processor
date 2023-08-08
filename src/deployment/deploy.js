import { existsSync } from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { readMetadata } from '../normalization/utils.js';
import { info } from '../utils/logging.js';
import { reifyDoTurtle, reifyRedundantTurtle } from '../utils/reify.js';

export function deploy(context) {
  const obj = context.selectedDigitalObject;
  const deployPath = resolve(context.deploymentHome, obj.doString);
  const metadata = readMetadata(context);
  const graph = resolve(deployPath, 'graph.ttl');

  sh.mkdir('-p', resolve(deployPath, 'assets'));
  sh.cp(resolve(obj.path, 'packaged/*'), deployPath);
  sh.cp(resolve(obj.path, 'enriched/enriched.ttl'), graph);

  for (const file of metadata.datatable) {
    sh.cp(resolve(obj.path, 'raw', file), resolve(deployPath, 'assets', file));
  }

  info(`Reifying "${obj.doString}"`);
  reifyDoTurtle(context, graph);

  // Check if the enrichment produces redundant graph
  const redundant = resolve(obj.path, 'enriched/redundant.ttl')
  if (existsSync(redundant)) {
    const redundantDeployPath = resolve(deployPath, 'redundant.ttl');
    sh.cp(redundant, redundantDeployPath);
    reifyRedundantTurtle(context, redundantDeployPath);
  }
}