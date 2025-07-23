import { resolve } from 'path';
import sh from 'shelljs';
import { header, error } from '../utils/logging.js';
import { reconstructAsctb } from './reconstruct-asct-b.js';
import { reconstructOmap } from './reconstruct-omap.js';
import { reconstructCtann } from './reconstruct-ctann.js';
import { reconstructRefOrgan } from './reconstruct-ref-organ.js';
import { reconstruct2dFtu } from './reconstruct-2d-ftu.js';
import { reconstructCollection } from './reconstruct-collection.js';
import { cleanDirectory } from './utils.js';

export function reconstruct(context) {
  const { selectedDigitalObject: obj } = context;
  sh.mkdir('-p', resolve(obj.path, 'reconstructed'));
  header(context, 'run-reconstruction');

  // Clean up any existing files
  cleanDirectory(context);

  switch (obj.type) {
    case 'asct-b':
      reconstructAsctb(context);
      break;
    case 'omap':
      reconstructOmap(context);
      break;
    case 'ctann':
      reconstructCtann(context);
      break;
    case 'ref-organ':
      reconstructRefOrgan(context);
      break;
    case '2d-ftu':
      reconstruct2dFtu(context);
      break;
    case 'collection':
      reconstructCollection(context);
      break;
    default:
      error(`"${obj.type}" digital object type is not supported for reconstruction.`);
      break;
  }
}
