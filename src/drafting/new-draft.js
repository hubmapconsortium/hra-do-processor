import { resolve } from 'path';
import { getLatestDigitalObject } from '../utils/get-latest.js';
import sh from 'shelljs';
import semver from 'semver';
import { existsSync } from 'fs';

/**
 * Creates a new draft for the selected digital object. If the version is not specified, it adds the latest version to the draft. If the --force flag is passed, it replaces the existing draft.
 * @param {object} context
 */
export function newDraft(context) {
  const { selectedDigitalObject: obj, force, latest } = context;

  let version = obj.version;
  if (latest || !semver.valid(semver.coerce(version))) {
    const latest = getLatestDigitalObject(context.doHome, obj.type, obj.name, obj.iri);
    version = latest.version;
  }

  const sourcePath = resolve(context.doHome, obj.type, obj.name, version, 'raw');
  const draftPath = resolve(context.doHome, obj.type, obj.name, 'draft');

  if (force) {
    sh.rm('-rf', draftPath);
  }

  if (!existsSync(draftPath)) {
    sh.cp('-r', sourcePath, draftPath);
  } else {
    console.error('Draft already exists');
  }
}
