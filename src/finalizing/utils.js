import { existsSync } from 'fs';
import { globSync } from 'glob';
import { resolve } from 'path';
import { getDigitalObjectInformation } from '../utils/digital-object.js';

/**
 * Get all deployed digital objects in the "do string" format: doType/doName/doVersion
 *
 * @param {object} context the context the CLI is running in
 * @param {boolean} versionedOnly whether to include just versioned DOs (excludes latest and draft), default is true
 * @returns an array of digital object strings
 */
export function getDeployedDigitalObjects(context, versionedOnly = true) {
  return (
    // find all directories in deployHome with a graph.ttl
    globSync('**/graph.ttl', { cwd: context.deploymentHome })
      // reformat to do name format
      .map((p) => p.split('/').slice(-4, -1).join('/'))
      // filter out latest and draft versions, if versionedOnly
      .filter((p) => !versionedOnly || (!p.includes('/latest/') && !p.includes('/draft/')))
      // Convert to a digital object "object"
      .map((p) => getDigitalObjectInformation(p, context.purlIri))
  );
}



export function getRedundantGraph(context, digitalObject) {
  const redundant = resolve(context.deploymentHome, digitalObject.doString, 'redundant.ttl');
  if (existsSync(redundant)) {
    return redundant;
  } else {
    return undefined;
  }
}
