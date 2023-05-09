import { resolve } from 'path';
import sh from 'shelljs';
import { enrichAsctb } from './enrich-asct-b.js';
import { enrichCollection } from './enrich-collection.js';
import { enrichRefOrgan } from './enrich-ref-organ.js';

export function enrich(context) {
  const obj = context.selectedDigitalObject;
  sh.mkdir('-p', resolve(obj.path, 'enriched'));
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
