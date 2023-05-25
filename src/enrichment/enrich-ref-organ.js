import { resolve } from 'path';
import { header, info } from '../utils/logging.js';
import { cleanTemporaryFiles, convertNormalized, convertNormalizedToOwl } from './utils.js';
import { convert, merge } from '../utils/robot.js';

export function enrichRefOrgan(context) {
  header(context, 'run-enrich');
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const ontologyPath = resolve(obj.path, 'enriched/ontology.ttl');

  try {
    convertNormalizedToOwl(context, normalizedPath, ontologyPath);
    convertNormalized(context);

    const turtleEnrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
    const enrichedPath = resolve(obj.path, 'enriched/enriched.owl');
    merge([ontologyPath, turtleEnrichedPath], enrichedPath);

    info(`Creating ref-organ: ${turtleEnrichedPath}`);
    convert(enrichedPath, turtleEnrichedPath, 'ttl');
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
  }
}
