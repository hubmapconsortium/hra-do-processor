import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { readMetadata, writeNormalized } from './utils.js';

export function normalizeCollection(context) {
  const obj = context.selectedDigitalObject;
  const metadata = readMetadata(obj);

  const dataPath = resolve(obj.path, 'raw', metadata.datatable);
  const data = load(readFileSync(dataPath))['digital-objects'];

  writeNormalized(obj, metadata, data);
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
