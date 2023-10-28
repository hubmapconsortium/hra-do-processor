import { resolve } from 'path';
import sh from 'shelljs';

const VERSIONS = ['v1.0.0', 'v1.6.0', 'v1.8.0', 'v1.9.4', 'v1.10.0', 'v2.0.1', 'v2.1.0', 'v2.2.0', 'v2.2.1'];

export async function migrateCcfOwl(context) {
  const templateFile = resolve(context.processorHome, 'src/migration/ccf-owl/metadata-template.yaml');
  for (const version of VERSIONS) {
    const rawDir = resolve(context.doHome, 'graph/ccf', version, 'raw');
    sh.mkdir('-p', rawDir);
    sh.exec(`curl -s -L https://ccf-ontology.hubmapconsortium.org/${version}/ccf.owl -o ${rawDir}/ccf.owl`);
    sh.cp(templateFile, resolve(rawDir, 'metadata.yaml'));
  }
}
