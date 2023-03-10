import { normalizeAsctb } from './normalize-asct-b.js';
import { normalizeCollection } from './normalize-collection.js';
import { normalizeRefOrgan } from './normalize-ref-organ.js';

export function normalize(context) {
  const obj = context.selectedDigitalObject;
  switch (obj.type) {
    case 'asct-b':
      normalizeAsctb(context);
      break;
    case 'collection':
      normalizeCollection(context);
      break;
    case 'ref-organ':
      normalizeRefOrgan(context);
      break;
    default:
      console.log(`normalize: "${obj.type}" digital object type not supported (yet)`);
      break;
  }
}
