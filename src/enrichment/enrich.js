import { enrichAsctb } from './enrich-asct-b.js';
import { enrichRefOrgan } from './enrich-ref-organ.js';

export function enrich(environment) {
  const obj = environment.selectedDigitalObject;
  switch (obj.type) {
    case 'asct-b':
      enrichAsctb(environment);
      break;
    case 'ref-organ':
      enrichRefOrgan(environment);
      break;
    default:
      console.log(`enrich: "${obj.type}" digital object type not supported (yet)`);
      break;
  }
}
