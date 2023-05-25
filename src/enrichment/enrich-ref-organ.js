import { header } from '../utils/logging.js';
import { convertNormalized, prettifyEnriched } from './utils.js';

export function enrichRefOrgan(context) {
  header(context, 'run-enrich');
  convertNormalized(context);
  prettifyEnriched(context);
}
