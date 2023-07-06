import fs from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { getDeployedDigitalObjects } from './utils.js';
import { getLatestDigitalObject } from '../utils/get-latest.js';

/**
 * Evaluates the deployment home and derives a 'latest' version for each digital object.
 * Practically, this means that for each digital object there will be a version called 'latest' that can be used/referenced.
 *
 * @param {object} context
 */
export function deriveLatest(context) {
  const deployedDigitalObjects = getDeployedDigitalObjects(context);
  const doTypeAndNames = Array.from(new Set(deployedDigitalObjects.map((obj) => [obj.type, obj.name].join('/'))));

  for (const doTypeAndName of doTypeAndNames) {
    const latest = getLatestDigitalObject(context.deploymentHome, ...doTypeAndName.split('/'), context.purlIri);
    if (latest) {
      const latestPath = resolve(context.deploymentHome, doTypeAndName, 'latest');
      const latestVersionedPath = resolve(context.deploymentHome, latest.doString);

      if (fs.existsSync(latestPath)) {
        sh.rm('-r', latestPath);
      }
      sh.cp('-r', latestVersionedPath, latestPath);
    }
  }
}
