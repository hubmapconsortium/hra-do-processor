import semver from 'semver';
import sh from 'shelljs';
import { getLatestDigitalObject } from '../utils/get-latest.js';
import { resolve } from 'path';
import { existsSync } from 'fs';

/**
 * Converts the draft into the latest version based on the given option, default is --minor
 * @param {Object} context
 */
export function bumpDraft(context) {
  const { selectedDigitalObject: obj, major, patch } = context;
  let latest = getLatestDigitalObject(context.doHome, obj.type, obj.name, obj.iri)?.version ?? '0';

  const releaseType = major ? 'major' : patch ? 'patch' : 'minor';
  latest = semver.inc(semver.coerce(latest), releaseType);

  //  formating the version
  const newVersion =
    semver.patch(latest) == 0
      ? `v${semver.major(latest)}.${semver.minor(latest)}`
      : `v${semver.major(latest)}.${semver.minor(latest)}.${semver.patch(latest)}`;

  const draftPath = resolve(obj.path);
  const newVersionPath = resolve(context.doHome, obj.type, obj.name, newVersion, 'raw');

  if (existsSync(newVersionPath)) {
    sh.rm('-r', newVersionPath);
  }

  sh.mkdir('-p', newVersionPath);
  sh.mv(`${draftPath}/raw/*`, newVersionPath);
  sh.rm('-rf', draftPath);
}
