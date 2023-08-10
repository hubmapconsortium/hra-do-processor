import { resolve } from 'path';
import sh from 'shelljs';
import { enrichAsctbMetadata, enrichAsctbData } from './enrich-asct-b.js';
import { enrichRefOrganMetadata, enrichRefOrganData } from './enrich-ref-organ.js';
import { enrichCollectionMetadata, enrichCollectionData } from './enrich-collection.js';
import { header } from '../utils/logging.js';

export function enrich(context) {
  const obj = context.selectedDigitalObject;
  sh.mkdir('-p', resolve(obj.path, 'enriched'));
  header(context, 'run-enrich');
  switch (obj.type) {
    case 'asct-b':
      enrichAsctbMetadata(context);
      enrichAsctbData(context);
      break;
    case 'ref-organ':
      enrichRefOrganMetadata(context);
      enrichRefOrganData(context);
      break;
    case 'collection':
      enrichCollectionMetadata(context);
      enrichCollectionData(context);
      break;
    default:
      console.log(`enrich: "${obj.type}" digital object type not supported (yet)`);
      break;
  }
}
