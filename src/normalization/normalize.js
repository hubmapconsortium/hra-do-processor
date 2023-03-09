import { normalizeAsctb } from './normalize-asct-b.js';
import { normalizeRefOrgan } from './normalize-ref-organ.js';

export function normalize(environment) {
  const obj = environment.selectedDigitalObject;
  switch (obj.type) {
    case 'asct-b':
      normalizeAsctb(environment);
      break;
    case 'ref-organ':
      normalizeRefOrgan(environment);
      break;
    default:
      console.log(`normalize: "${obj.type}" digital object type not supported (yet)`);
      break;
  }
}
