import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { globSync } from 'glob';
import semver from 'semver';

export function deriveLatest(context) {
  const obj = context.selectedDigitalObject;

  //Extracting path and version

  
  const glob = '**/graph.ttl';
  const digitalObjects = globSync(glob, { cwd: context.deployHome }).map((p) => p.split('/').slice(0, -1).join('/'));

  console.log(digitalObjects)


  for (const digitalObject of digitalObjects) {
    //Getting list of versions
    const lastIndex = digitalObject.lastIndexOf('/');
    const versions = readdirSync(digitalObject.substring(0, lastIndex));

    let sortedVersions = versions;

    if (versions.length > 1) {
      //Sorting the version in descending order
      sortedVersions = versions.sort((a, b) => {
        const versionA = a.replace('v', '');
        const versionB = b.replace('v', '');

        console.log(versionA, versionB);
        // Skip processing invalid versions
        if (!semver.valid(versionA) || !semver.valid(versionB)) {
          console.log('semver is not valid');
          console.log(versionA, versionB);
          return 0;
        }

        return semver.gt(versionB, versionA);
      });
    }

    // Getting the latest version
    const latestVersion = sortedVersions[0];

    console.log(latestVersion)

    // Writing the latest version to the 'latest' file
    sh.rm('-r', `${digitalObjects}/latest`);
    sh.mkdir(`${digitalObjects}/latest`);
    sh.cp('-r', `${digitalObjects}/${latestVersion}`, `${digitalObjects}/latest`);
  }
}
