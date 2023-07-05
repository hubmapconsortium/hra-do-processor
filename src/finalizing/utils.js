import { readdirSync } from 'fs';
import { globSync } from 'glob';
import { resolve } from 'path';
import semver from 'semver';
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

/**
 * Evaluates the deployment directory for a DO to determine it's latest version
 *
 * @param {object} context the context the CLI is running in
 * @param {string} doType the digital object type
 * @param {string} doName the digital object name
 * @returns the digital object that is the latest version
 */
export function getLatestDigitalObject(context, doType, doName) {
  const digitalObjectDir = resolve(context.deploymentHome, doType, doName);

  // Find all subdirectories in deployHome for a digital object type + name
  const versions = readdirSync(digitalObjectDir)
    // Filter out subdirectories which don't look like a version
    .filter((v) => v.startsWith('v') && semver.valid(semver.coerce(v)))
    // Sort by version, latest to oldest
    .sort((a, b) => semver.compare(semver.coerce(b), semver.coerce(a)));

  if (versions.length > 0) {
    // Convert to a digital object "object"
    return getDigitalObjectInformation([doType, doName, versions[0]].join('/'), context.purlIri);
  } else {
    return undefined;
  }
}
