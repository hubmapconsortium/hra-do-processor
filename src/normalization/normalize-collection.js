import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { readMetadata, writeNormalized } from './utils.js';
import { header } from '../utils/logging.js';

export function normalizeCollection(context) {
  header(context, 'run-normalize');
  const { path } = context.selectedDigitalObject;
  const metadata = readMetadata(path);

  const dataPath = resolve(path, 'raw', metadata.datatable);
  const data = load(readFileSync(dataPath))['digital-objects'];

  writeNormalized(context, data);
  validateCollection(context, data);
}

function validateCollection(context, data) {
  let isValid = true;
  if (!context.skipValidation) {
    for (const collectedObj of data) {
      if (!existsSync(resolve(context.doHome, collectedObj, 'raw/metadata.yaml'))) {
        console.log(chalk.red(collectedObj, 'does not exist or is invalid'));
        isValid = false;
      }
    }
  }
  return isValid;
}
