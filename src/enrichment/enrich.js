import { resolve } from 'path';
import sh from 'shelljs';
import { header, warning } from '../utils/logging.js';
import { enrich2dFtuData, enrich2dFtuMetadata } from './enrich-2d-ftu.js';
import { enrichAsctbData, enrichAsctbMetadata } from './enrich-asct-b.js';
import { enrichBasicData, enrichBasicMetadata } from './enrich-basic.js';
import { enrichCollectionData, enrichCollectionMetadata } from './enrich-collection.js';
import { enrichGraphData, enrichGraphMetadata } from './enrich-graph.js';
import { enrichRefOrganData, enrichRefOrganMetadata } from './enrich-ref-organ.js';
import { enrichLandmarkData, enrichLandmarkMetadata } from './enrich-landmark.js';

export function enrich(context) {
  const obj = context.selectedDigitalObject;
  sh.mkdir('-p', resolve(obj.path, 'enriched'));
  header(context, 'run-enrich');
  let processedType = obj.name.endsWith('crosswalk') ? 'basic' : obj.type;
  switch (processedType) {
    case 'asct-b':
      enrichAsctbMetadata(context);
      enrichAsctbData(context);
      break;
    case 'ref-organ':
      enrichRefOrganMetadata(context);
      enrichRefOrganData(context);
      break;
    case 'landmark':
      enrichLandmarkMetadata(context);
      enrichLandmarkData(context);
      break;
    case '2d-ftu':
      enrich2dFtuMetadata(context);
      enrich2dFtuData(context);
      break;
    case 'collection':
      enrichCollectionMetadata(context);
      enrichCollectionData(context);
      break;
    case 'vocab':
    case 'graph':
    case 'g':
      enrichGraphMetadata(context);
      enrichGraphData(context);
      break;
    default:
      warning(`"${obj.type}" digital object type is using basic processing.`);
      enrichBasicMetadata(context);
      enrichBasicData(context);
      break;
  }
}
