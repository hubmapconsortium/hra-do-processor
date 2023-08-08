import { resolve } from 'path';
import sh from 'shelljs';
import { normalizeAsctbMetadata, normalizeAsctbData } from './normalize-asct-b.js';
import { normalizeCollection } from './normalize-collection.js';
import { normalizeRefOrganMetadata, normalizeRefOrganData } from './normalize-ref-organ.js';
import { validateNormalizedMetadata, validateNormalizedData } from '../utils/validation.js';
import { header } from '../utils/logging.js';

export async function normalize(context) {
  const { selectedDigitalObject: obj } = context;
  sh.mkdir('-p', resolve(obj.path, 'normalized'));
  header(context, 'run-normalize');
  switch (obj.type) {
    case 'asct-b':
      normalizeAsctbMetadata(context);
      await normalizeAsctbData(context);
      break;
    case 'ref-organ':
      normalizeRefOrganMetadata(context);
      await normalizeRefOrganData(context);
      break;
    case 'collection':
      normalizeCollection(context);
      break;
    default:
      throw new Error(`The "${obj.type}" digital object type not supported (yet).`);
  }
  // Validate the produced metadata and data
  validate(context);
}

function validate(context) {
  const { skipValidation } = context;
  header(context, 'run-validation');
  if (skipValidation) {
    info('Skip validation.');
  } else {
    validateNormalizedMetadata(context);
    validateNormalizedData(context);
  }
}
