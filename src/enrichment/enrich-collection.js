import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { header } from '../utils/logging.js';
import { mergeTurtles } from '../utils/owl-cli.js';

export function enrichCollection(context) {
  header(context, 'run-enrich');
  const obj = context.selectedDigitalObject;
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const data = load(readFileSync(normalizedPath))['data'];
  const isValid = validateCollection(context, data);
  if (!isValid) {
    console.log(chalk.red('Error: cannot enrich', obj.doString, 'until all referenced digital objects are enriched.'));
    return;
  }

  const dataPaths = data.map((s) => resolve(context.doHome, s, 'enriched/enriched.ttl'));
  const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
  const prefixes = resolve(context.processorHome, 'schemas/prefixes.json');
  mergeTurtles(enrichedPath, prefixes, dataPaths);
}

function validateCollection(context, data) {
  let isValid = true;
  if (!context.skipValidation) {
    for (const collectedObj of data) {
      if (!existsSync(resolve(context.doHome, collectedObj, 'enriched/enriched.ttl'))) {
        console.log(chalk.red(collectedObj, 'does not exist or is invalid'));
        isValid = false;
      }
    }
  }
  return isValid;
}
