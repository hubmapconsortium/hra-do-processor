import { resolve } from 'path';
import sh from 'shelljs';
import { header, warning } from '../utils/logging.js';
import { enrich2dFtuData, enrich2dFtuMetadata } from './enrich-2d-ftu.js';
import { enrichAsctbData, enrichAsctbMetadata } from './enrich-asct-b.js';
import { enrichBasicData, enrichBasicMetadata } from './enrich-basic.js';
import { enrichCollectionData, enrichCollectionMetadata } from './enrich-collection.js';
import { enrichRefOrganData, enrichRefOrganMetadata } from './enrich-ref-organ.js';

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
    case '2d-ftu':
      enrich2dFtuMetadata(context);
      enrich2dFtuData(context);
      break;
    case 'collection':
      enrichCollectionMetadata(context);
      enrichCollectionData(context);
      break;
    default:
      warning(`"${obj.type}" digital object type is using basic processing.`);
      enrichBasicMetadata(context);
      enrichBasicData(context);
      break;
  }
}
