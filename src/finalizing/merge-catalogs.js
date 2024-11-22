import { resolve } from 'path';
import sh from 'shelljs';
import { mergeTurtles, reifyTurtle } from '../utils/reify.js';

export function mergeCatalogs(context) {
  const graphs = listMetadataGraphs(context);
  const catalogPath = resolve(context.deploymentHome, 'catalog.ttl');
  const graphName = context.lodIri.replace(/\/$/, '');
  mergeTurtles(catalogPath, undefined, graphs);
  reifyTurtle(catalogPath, graphName, true);
}

function listMetadataGraphs(context) {
  return sh.exec(`find ${resolve(context.deploymentHome)} -name metadata.ttl`).split('\n');
}
