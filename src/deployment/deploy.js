import { resolve } from 'path';
import sh from 'shelljs';
import { readMetadata } from '../normalization/utils.js';
import { loadDoIntoTripleStore } from '../utils/blazegraph.js';
import { reifyTurtle } from '../utils/reify.js';

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
  loadDoIntoTripleStore(context, tripleStore);
  reifyTurtle(context, datasetPath, tripleStore);
}
