import { relative, resolve } from 'path';
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
  const dist = relative(process.cwd(), context.deploymentHome);
  return sh.exec(`find ${dist} -name metadata.ttl`).split('\n');
}
