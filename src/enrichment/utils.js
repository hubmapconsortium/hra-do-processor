import chalk from 'chalk';
import { resolve } from 'path';
import sh from 'shelljs';

export function convertNormalized(context) {
  const { selectedDigitalObject: obj, processorHome, skipValidation } = context;

  const schema = resolve(processorHome, 'schemas/digital-objects', `${obj.type}.yaml`);
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');

  const results = sh.exec(
    `linkml-convert ${skipValidation ? '--no-validate' : ''} --schema ${schema} ${normalizedPath} -o ${enrichedPath}`
  );
  const success = results.code !== 1;
  if (!success) {
    console.log(chalk.red('Enrichment failed. See errors above.'));
  }

  return success;
}
