import { InvalidArgumentError } from 'commander';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { dirname, isAbsolute, resolve } from 'path';
import { getDigitalObjectInformation } from './digital-object.js';
import { getDirName } from './source-info.js';

const DEFAULT_PURL_IRI = process.env.DEFAULT_PURL_IRI || 'https://purl.humanatlas.io/';
const DEFAULT_LOD_IRI = process.env.DEFAULT_LOD_IRI || 'https://lod.humanatlas.io/';
const DEFAULT_CDN_IRI = process.env.DEFAULT_CDN_IRI || 'https://cdn.humanatlas.io/digital-objects/';

const DEFAULT_DO_HOME = resolve(process.env.DO_HOME || './digital-objects');
const DEFAULT_DEPLOY_HOME = resolve(process.env.DEPLOY_HOME || './dist');
export const PROCESSOR_HOME = resolve(process.env.PROCESSOR_HOME || dirname(dirname(getDirName(import.meta.url))));

export function getProcessorVersion() {
  const packageJson = JSON.parse(readFileSync(resolve(PROCESSOR_HOME, 'package.json')));
  return packageJson.version;
}

export function getContext(program, subcommand, selectedDigitalObject) {
  const context = {
    doHome: DEFAULT_DO_HOME,
    processorHome: PROCESSOR_HOME,
    deploymentHome: DEFAULT_DEPLOY_HOME,
    baseIri: DEFAULT_PURL_IRI,
    lodIri: DEFAULT_LOD_IRI,
    cdnIri: DEFAULT_CDN_IRI,
    ...program.opts(),
    ...subcommand.opts(),
  };
  if (selectedDigitalObject) {
    try {
      const doPath = parseDirectory(selectedDigitalObject, context.doHome);
      context.selectedDigitalObject = getDigitalObjectInformation(doPath, context.baseIri);
    } catch (error) {
      program.error(error.message);
    }
  }

  return context;
}

export function parseDirectory(path, baseDir) {
  if (baseDir && !isAbsolute(path)) {
    const baseDirPath = resolve(baseDir, path);
    if (existsSync(baseDirPath)) {
      path = baseDirPath;
    }
  }
  if (existsSync(path)) {
    if (lstatSync(path).isDirectory()) {
      return resolve(path);
    } else {
      throw new InvalidArgumentError(`${path} exists, but is not a directory`);
    }
  } else {
    throw new InvalidArgumentError(`${path} does not exist`);
  }
}
