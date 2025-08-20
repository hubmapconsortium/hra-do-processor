import { readdirSync } from 'fs';
import { resolve } from 'path';
import semver from 'semver';
import { getDigitalObjectInformation } from './digital-object.js';

/**
 * Evaluates the deployment directory for a DO to determine it's latest version
 *
 * @param {object} context the context the CLI is running in
 * @param {string} doType the digital object type
 * @param {string} doName the digital object name
 * @returns the digital object that is the latest version
 */
export function getLatestDigitalObject(doPath, doType, doName, purlIri) {
  const versions = getDigitalObjectVersions(doPath, doType, doName);

  if (versions.length > 0) {
    // Convert to a digital object "object"
    return getDigitalObjectInformation([doType, doName, versions[0]].join('/'), purlIri);
  } else {
    return undefined;
  }
}

export function getDigitalObjectVersions(doPath, doType, doName) {
  const digitalObjectDir = resolve(doPath, doType, doName);

  // Find all subdirectories in deployHome for a digital object type + name
  const versions = readdirSync(digitalObjectDir)
    // Filter out subdirectories which don't look like a version
    .filter((v) => v.startsWith('v') && semver.valid(semver.coerce(v)))
    // Sort by version, latest to oldest
    .sort((a, b) => semver.compare(semver.coerce(b), semver.coerce(a)));

  return versions;
}

export function getPreviousVersionDigitalObject(doPath, doType, doName, doVersion, purlIri) {
  const versions = getDigitalObjectVersions(doPath, doType, doName).reverse();
  const index = versions.indexOf(doVersion);
  if (versions.length > 1 && index > 0) {
    return getDigitalObjectInformation(resolve(doPath, doType, doName, versions[index - 1]), purlIri);
  } else {
    return undefined;
  }
}

export function getNextVersionDigitalObject(doPath, doType, doName, doVersion, purlIri) {
  const versions = getDigitalObjectVersions(doPath, doType, doName);
  const index = versions.indexOf(doVersion);
  if (versions.length > 1 && index > 0) {
    return getDigitalObjectInformation(resolve(doPath, doType, doName, versions[index - 1]), purlIri);
  } else {
    return undefined;
  }
}
