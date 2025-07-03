import { resolve } from 'path';
import sh from 'shelljs';
import { header, warning } from '../utils/logging.js';
import { reconstructAsctb } from './reconstruct-asct-b.js';
import { reconstructOmap } from './reconstruct-omap.js';
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
    case 'ref-organ':
    case '2d-ftu':
    case 'collection':
      warning(`"${obj.type}" digital object type is not yet implemented.`);
      break;
    default:
      error(`"${obj.type}" digital object type is not supported for reconstruction.`);
      break;
  }
}
