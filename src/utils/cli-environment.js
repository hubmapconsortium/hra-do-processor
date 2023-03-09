import { InvalidArgumentError } from 'commander';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { dirname, isAbsolute, resolve } from 'path';
import { getDirName } from './source-info.js';

const DEFAULT_DO_HOME = resolve(process.env.DO_HOME || './digital-objects');
export const PROCESSOR_HOME = resolve(process.env.PROCESSOR_HOME || dirname(dirname(getDirName(import.meta.url))));

export function getProcessorVersion() {
  const packageJson = JSON.parse(readFileSync(resolve(PROCESSOR_HOME, 'package.json')));
  return packageJson.version;
}

export function getEnvironment(program, subcommand, selectedDigitalObject) {
  const environment = {
    doHome: DEFAULT_DO_HOME,
    processorHome: PROCESSOR_HOME,
    ...program.opts(),
    ...subcommand.opts(),
  };
  if (selectedDigitalObject) {
    try {
      environment.selectedDigitalObject = parseDirectory(selectedDigitalObject, environment.doHome);
    } catch (error) {
      program.error(error.message);
    }
  }

  return environment;
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
