import { resolve } from 'path';
import sh from 'shelljs';
import { header, info, warning } from '../utils/logging.js';
import { validateNormalizedData, validateNormalizedMetadata } from '../utils/validation.js';
import { normalize2dFtuData, normalize2dFtuMetadata } from './normalize-2d-ftu.js';
import { normalizeAsctbData, normalizeAsctbMetadata } from './normalize-asct-b.js';
import { normalizeBasicData, normalizeBasicMetadata } from './normalize-basic.js';
import { normalizeCollectionData, normalizeCollectionMetadata } from './normalize-collection.js';
import { normalizeGraphData, normalizeGraphMetadata } from './normalize-graph.js';
import { normalizeLandmarkData, normalizeLandmarkMetadata } from './normalize-landmark.js';
import { normalizeOmapData, normalizeOmapMetadata } from './normalize-omap.js';
import { normalizeDatasetGraphData, normalizeDatasetGraphMetadata } from './normalize-ds-graph.js';
import { normalizeRefOrganData, normalizeRefOrganMetadata } from './normalize-ref-organ.js';
import { cleanDirectory } from './utils.js';

export async function normalize(context) {
  const { selectedDigitalObject: obj } = context;
  sh.mkdir('-p', resolve(obj.path, 'normalized'));
  header(context, 'run-normalize');

  // Clean up any existing files
  cleanDirectory(context);

  let processedType = obj.name.endsWith('crosswalk') ? 'basic' : obj.type;
  switch (processedType) {
    case 'asct-b':
      normalizeAsctbMetadata(context);
      await normalizeAsctbData(context);
      break;
    case 'ref-organ':
      normalizeRefOrganMetadata(context);
      await normalizeRefOrganData(context);
      break;
    case 'landmark':
      normalizeLandmarkMetadata(context);
      await normalizeLandmarkData(context);
      break;
    case '2d-ftu':
      normalize2dFtuMetadata(context);
      await normalize2dFtuData(context);
      break;
    case 'omap':
      normalizeOmapMetadata(context);
      processedType = await normalizeOmapData(context);
      break;
    case 'collection':
      normalizeCollectionMetadata(context);
      normalizeCollectionData(context);
      break;
    case 'ds-graph':
      await normalizeDatasetGraphData(context);
      normalizeDatasetGraphMetadata(context);
      break;
    case 'vocab':
    case 'graph':
    case 'g':
      normalizeGraphMetadata(context);
      normalizeGraphData(context);
      processedType = 'graph';
      break;
    default:
      warning(`"${obj.type}" digital object type is using basic processing.`);
      normalizeBasicMetadata(context);
      normalizeBasicData(context);
      processedType = 'basic';
      break;
  }
  // Validate the produced metadata and data
  validate(context, processedType);
}

function validate(context, overrideType) {
  const { skipValidation } = context;
  header(context, 'run-validation');
  if (skipValidation) {
    info('Skip validation.');
  } else {
    validateNormalizedMetadata(context, overrideType);
    validateNormalizedData(context, overrideType);
  }
}
