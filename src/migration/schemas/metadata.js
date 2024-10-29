import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';

export function writeMetadata(context, outputPath, overrides) {
  const templateFile = resolve(context.processorHome, 'src/migration/schemas/metadata-template.yaml');
  const metadata = {
    ...load(readFileSync(templateFile).toString()),
    ...overrides,
  };
  writeFileSync(outputPath, dump(metadata));
}
