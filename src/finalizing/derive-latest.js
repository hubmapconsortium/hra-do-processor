import fs, { readdirSync } from 'fs';
import sh from 'shelljs';
import { globSync } from 'glob';
import semver from 'semver';

/**
 * @description Among the list of versions, gets the latest version and adds it to the latest directory in dist/do-type/do-name/latest
 * @param {*} context
 * @return returns the latest version
 */

export async function deriveLatest(context) {
  //Extracting path
  const glob = '**/graph.ttl';
  const digitalObjects = globSync(glob, { cwd: context.deployHome }).map((p) => p.split('/').slice(0, -2).join('/'));

  for (const digitalObject of digitalObjects) {
    //Getting list of versions
    const versions = readdirSync(digitalObject).filter((v) => v != 'latest');

    const obj = digitalObject.split('/').slice(0, 3).join('/');
    try {
      if (fs.existsSync(`${obj}/latest`)) {
        sh.rm('-r', `${obj}/latest`);
      }
    } catch (error) {
      console.error('Error while deleting latest directory', error);
    }
    let sortedVersions = versions;

    if (versions.length > 1) {
      //Sorting the version in descending order
      sortedVersions = versions.sort(async (a, b) => {
        let versionA = a.replace('v', '');
        let versionB = b.replace('v', '');

        versionA = await validateVersion(versionA);
        versionB = await validateVersion(versionB);

        // Skip processing invalid versions
        if (!semver.valid(versionA) || !semver.valid(versionB)) {
          console.error('Invalid Version');
        }
        return semver.gt(versionA, versionB);
      });
    }

    // Getting the latest version
    const latestVersion = sortedVersions[sortedVersions.length - 1];
    const latestObj = `${obj}/${latestVersion}`;

    // Writing the latest version to the 'latest' directory
    sh.mkdir(`${obj}/latest`);
    sh.cp('-r', `${latestObj}`, `${obj}/latest`);
  }
}

/**
 * @description Function validates if the version is valid for semver to process if not it fixes the invalid version to a valid one
 * @param {*} version
 * @returns
 */

async function validateVersion(version) {
  const segments = version.split('.');
  const length = segments.length;

  if (length < 3) {
    while (segments.length < 3) {
      segments.push('0');
    }
    return segments.join('.');
  } else {
    return version;
  }
}
