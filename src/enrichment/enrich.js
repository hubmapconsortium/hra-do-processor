import { enrichAsctb } from './enrich-asct-b.js';
import { enrichCollection } from './enrich-collection.js';
import { enrichRefOrgan } from './enrich-ref-organ.js';

export function enrich(context) {
  const obj = context.selectedDigitalObject;
  switch (obj.type) {
    case 'asct-b':
      enrichAsctb(context);
      break;
    case 'collection':
      enrichCollection(context);
      break;
    case 'ref-organ':
      enrichRefOrgan(context);
      break;
    default:
      console.log(`enrich: "${obj.type}" digital object type not supported (yet)`);
      break;
  }
}
