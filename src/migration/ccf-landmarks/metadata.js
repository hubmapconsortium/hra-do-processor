import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';

export function writeMetadata(context, overrides) {
  const templateFile = resolve(context.processorHome, 'src/migration/ccf-landmarks/metadata-template.yaml');
  const metadata = {
    ...load(readFileSync(templateFile).toString()),
    ...overrides,
  };

  const { path } = context.selectedDigitalObject;
  const normalizedPath = resolve(path, 'raw/metadata.yaml');
  writeFileSync(normalizedPath, dump(metadata));
}
