import { convertNormalizedToOwl } from './utils.js';

export function enrichAsctb(context) {
  // TODO: do more than a straight conversion to rdf
  convertNormalizedToOwl(context);
}
