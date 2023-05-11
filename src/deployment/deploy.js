import { resolve } from 'path';
import sh from 'shelljs';
import { readMetadata } from '../normalization/utils.js';

export function deploy(context) {
  const obj = context.selectedDigitalObject;
  const deployPath = resolve(context.deploymentHome, obj.doString);
  const metadata = readMetadata(obj.path);

  sh.mkdir('-p', resolve(deployPath, 'assets'));
  sh.cp(resolve(obj.path, 'packaged/*'), deployPath);
  sh.cp(resolve(obj.path, 'enriched/enriched.ttl'), resolve(deployPath, 'dataset.ttl'));

  for (const file of metadata.datatable) {
    sh.cp(resolve(obj.path, 'raw', file), resolve(deployPath, 'assets', file));
  }
}
