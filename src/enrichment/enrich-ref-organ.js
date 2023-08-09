import { resolve } from 'path';
import { error, header, info } from '../utils/logging.js';
import { convert, merge } from '../utils/robot.js';
import {
  cleanTemporaryFiles,
  convertNormalizedMetadataToRdf,
  convertNormalizedDataToOwl
} from './utils.js';

export function enrichRefOrganMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
}

export function enrichRefOrganData(context) {
  const { selectedDigitalObject: obj } = context;
  try {
    const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
    const ontologyPath = resolve(obj.path, 'enriched/ontology.ttl');
    const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');

    convertNormalizedDataToOwl(context, normalizedPath, ontologyPath);
    
    info(`Creating ref-organ: ${enrichedPath}`);
    convert(ontologyPath, enrichedPath, 'ttl');
  } catch (e) {
    error(e);
  } finally {
    // Clean up
    info('Cleaning up temporary files.');
    cleanTemporaryFiles(context);
  }
}
