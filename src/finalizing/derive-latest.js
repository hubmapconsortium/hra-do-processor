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
  const digitalObjects = new Set(
    globSync(glob, { cwd: context.deployHome }).map((p) => p.split('/').slice(0, -2).join('/'))
  );

  const filteredDigitalObjects = Array.from(digitalObjects).filter(
    (object) => !object.includes('/latest') && !object.includes('/draft')
  );

  for (const digitalObject of filteredDigitalObjects) {
    //Getting list of versions
    const versions = readdirSync(digitalObject).filter((v) => v.startsWith('v'));
    const obj = digitalObject.split('/').slice(0, 3).join('/');

    let sortedVersions = versions;
    const dirMap = {}; // To map directory to valid semver versions

    //normalizing versions to be processed by semver
    if (versions.length > 1) {
      sortedVersions = versions
        .map((version) => {
          let coercedVersion = semver.coerce(version);
          coercedVersion = semver.clean(coercedVersion.toString());
          dirMap[coercedVersion] = version;
          return coercedVersion;
        })
        .sort((a, b) => {
          return semver.gt(a, b) ? -1 : 1;
        });
    } else {
      console.warn('There Should be atleast one version');
    }

    // Getting the latest version
    let latestVersion = dirMap[sortedVersions[0]];
    const latestObj = `${obj}/${latestVersion}`;

    if (fs.existsSync(`${obj}/latest`)) {
      sh.rm('-r', `${obj}/latest`);
    }

    // Copying the latest version to the 'latest' directory
    sh.mkdir(`${obj}/latest`);
    sh.cp('-r', `${latestObj}`, `${obj}/latest`);
  }
}
