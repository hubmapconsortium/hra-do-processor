import semver from 'semver';
import sh from 'shelljs';
import { getDigitalObjectVersions } from '../utils/get-latest.js';
import { resolve } from 'path';
import { existsSync } from 'fs';

/** The version a digital object gets the first time its draft is released */
const FIRST_VERSION = 'v1.0';

/**
 * Converts the draft into the latest version based on the given option, default is --minor.
 * If the digital object has no released versions yet, the draft becomes v1.0.
 * @param {Object} context
 */
export function bumpDraft(context) {
  const { selectedDigitalObject: obj, major, patch } = context;

  // Only look at released versions. (getLatestDigitalObject falls back to the draft itself when nothing has been
  // released, and 'draft' can't be incremented.)
  const [latestReleased] = getDigitalObjectVersions(context.doHome, obj.type, obj.name);

  let newVersion = FIRST_VERSION;
  if (latestReleased) {
    const releaseType = major ? 'major' : patch ? 'patch' : 'minor';
    const next = semver.inc(semver.coerce(latestReleased), releaseType);

    //  formating the version
    newVersion =
      semver.patch(next) == 0
        ? `v${semver.major(next)}.${semver.minor(next)}`
        : `v${semver.major(next)}.${semver.minor(next)}.${semver.patch(next)}`;
  }

  const draftPath = resolve(obj.path);
  const newVersionPath = resolve(context.doHome, obj.type, obj.name, newVersion, 'raw');

  if (existsSync(newVersionPath)) {
    sh.rm('-r', newVersionPath);
  }

  sh.mkdir('-p', newVersionPath);
  sh.mv(`${draftPath}/raw/*`, newVersionPath);
  sh.rm('-rf', draftPath);
}
