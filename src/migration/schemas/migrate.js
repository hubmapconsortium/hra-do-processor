import { globSync } from 'glob';
import { basename, resolve } from 'path';
import sh from 'shelljs';
import { writeMetadata } from './metadata.js';

export function migrateSchemas(context) {
  const { processorHome, doHome, version = 'v1.0' } = context;

  const genDir = resolve(processorHome, 'schemas/generated');
  for (const doSpecFile of globSync(resolve(genDir, 'linkml/*.yaml'))) {
    const doType = basename(doSpecFile, '.yaml');
    const rawDir = resolve(doHome, 'schema', doType, version, 'raw');

    sh.mkdir('-p', rawDir);
    sh.rm('-rf', `${rawDir}/*`);
    sh.cp(doSpecFile, resolve(rawDir, 'schema.yaml'));
    sh.cp(resolve(genDir, `json-ld/${doType}.context.jsonld`), resolve(rawDir, 'schema.context.jsonld'));
    sh.cp(resolve(genDir, `json-schema/${doType}.schema.json`), resolve(rawDir, 'schema.json'));
    sh.cp(resolve(genDir, `erdiagram/${doType}.mmd`), resolve(rawDir, 'schema.mmd'));
    sh.cp(resolve(genDir, `erdiagram/${doType}.png`), resolve(rawDir, 'schema.png'));
    sh.cp(resolve(genDir, `erdiagram/${doType}.svg`), resolve(rawDir, 'schema.svg'));

    writeMetadata(context, resolve(rawDir, 'metadata.yaml'), {
      title: `HRA ${doType} linkml schema`,
      description: `Human Reference Atlas (HRA) <https://humanatlas.io> LinkML Schema for ${doType}`,
      // creation_date: new Date().toISOString().split('T')[0],
    });
  }
}
