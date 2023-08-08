import { resolve } from 'path';
import sh from 'shelljs';
import { normalizeAsctbMetadata, normalizeAsctbData } from './normalize-asct-b.js';
import { normalizeCollection } from './normalize-collection.js';
import { normalizeRefOrgan } from './normalize-ref-organ.js';
import { validateNormalizedMetadata, validateNormalizedData } from '../utils/validation.js';
import { header, error } from '../utils/logging.js';

export async function normalize(context) {
  const { selectedDigitalObject: obj, skipValidation } = context;
  sh.mkdir('-p', resolve(obj.path, 'normalized'));
  switch (obj.type) {
    case 'asct-b':
      // Produce normalized metadata and data
      header(context, 'run-normalize');
      normalizeAsctbMetadata(context);
      await normalizeAsctbData(context);

      // Validate the produced normalized metadata and data
      header(context, 'run-validation');
      if (skipValidation) {
        info('Skip validation.');
      } else {
        validateNormalizedMetadata(context);
        validateNormalizedData(context);
      }
      break;
    case 'collection':
      normalizeCollection(context);
      break;
    case 'ref-organ':
      await normalizeRefOrgan(context);
      break;
    default:
      error(`The "${obj.type}" digital object type not supported (yet)`);
      break;
  }
}
