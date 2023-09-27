import { globSync } from 'glob';

export function list(context) {
  const glob = '**/raw';
  const digitalObjects = globSync(glob, { cwd: context.doHome }).map((p) => p.split('/').slice(0, -1).join('/'));
  if (digitalObjects.length > 0) {
    console.log(digitalObjects.join('\n'));
  }
}

export function listDeployed(context) {
  const glob = '*/*/*/graph.ttl';
  const digitalObjects = globSync(glob, { cwd: context.deploymentHome }).map((p) => p.split('/').slice(0, -1).join('/'));
  return digitalObjects;
}
