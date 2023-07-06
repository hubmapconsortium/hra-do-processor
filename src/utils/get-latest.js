import semver from 'semver';
import { readdirSync } from 'fs';
import { getDigitalObjectInformation } from './digital-object.js';
import { resolve } from 'path';

/**
 * Evaluates the deployment directory for a DO to determine it's latest version
 *
 * @param {object} context the context the CLI is running in
 * @param {string} doType the digital object type
 * @param {string} doName the digital object name
 * @returns the digital object that is the latest version
 */
export function getLatestDigitalObject(doPath, doType, doName, purlIri) {
  const digitalObjectDir = resolve(doPath, doType, doName);

  // Find all subdirectories in deployHome for a digital object type + name
  const versions = readdirSync(digitalObjectDir)
    // Filter out subdirectories which don't look like a version
    .filter((v) => v.startsWith('v') && semver.valid(semver.coerce(v)))
    // Sort by version, latest to oldest
    .sort((a, b) => semver.compare(semver.coerce(b), semver.coerce(a)));

  if (versions.length > 0) {
    // Convert to a digital object "object"
    return getDigitalObjectInformation([doType, doName, versions[0]].join('/'), purlIri);
  } else {
    return undefined;
  }
}
