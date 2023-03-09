import { globSync } from 'glob';

export function list(environment) {
  const glob = '**/raw';
  const digitalObjects = globSync(glob, { cwd: environment.doHome }).map((p) => p.split('/').slice(0, -1).join('/'));
  if (digitalObjects.length > 0) {
    console.log(digitalObjects.join('\n'));
  }
}
