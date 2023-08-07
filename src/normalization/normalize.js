import { resolve } from 'path';
import sh from 'shelljs';
import { normalizeAsctbMetadata, normalizeAsctbData } from './normalize-asct-b.js';
import { normalizeCollection } from './normalize-collection.js';
import { normalizeRefOrgan } from './normalize-ref-organ.js';
import { header, error } from '../utils/logging.js';

export async function normalize(context) {
  const obj = context.selectedDigitalObject;
  sh.mkdir('-p', resolve(obj.path, 'normalized'));
  switch (obj.type) {
    case 'asct-b':
      header(context, 'run-normalize');
      normalizeAsctbMetadata(context);
      await normalizeAsctbData(context);
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
