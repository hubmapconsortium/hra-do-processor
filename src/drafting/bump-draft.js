import semver from 'semver';
import sh from 'shelljs';
import { getLatestDigitalObject } from '../utils/get-latest.js';
import { resolve } from 'path';

export function bumpDraft(context) {
  const { selectedDigitalObject: obj, major, patch } = context;
  let latest = getLatestDigitalObject(context.doHome, obj.type, obj.name, obj.iri)?.version ?? '0';

  const releaseType = major ? 'major' : patch ? 'patch' : 'minor';
  latest = semver.inc(semver.coerce(latest), releaseType);

  //   Removing the trailing zero from the version if present and concatinating 'v'.
  const newVersion = `v${latest.split('.').slice(0, -1).join('.')}${
    latest.endsWith('.0') ? '' : `.${latest.split('.').pop()}`
  }`;

  const draftPath = resolve(obj.path);
  const newVersionPath = resolve(context.doHome, obj.type, obj.name, newVersion, 'raw');

  sh.mkdir('-p', newVersionPath);
  sh.mv(`${draftPath}/*`, newVersionPath);
  sh.rm('-rf', draftPath);
}
