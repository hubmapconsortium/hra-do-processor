import { buildBlazegraphJournal } from './build-blazegraph.js';
import { createCatalogs } from './create-catalogs.js';
import { deriveLatest } from './derive-latest.js';
import { mergeCatalogs } from './merge-catalogs.js';
import { miscFiles } from './misc-files.js';

/**
 * Driver function which runs after completing a round of deployments. This function
 * runs a set of codes to process the deployment home in preparation for final deployment
 * to a server.
 *
 * @param {object} context
 */
export function finalize(context) {
  miscFiles(context);
  deriveLatest(context);
  createCatalogs(context);
  mergeCatalogs(context);
  if (!context.skipDb) {
    buildBlazegraphJournal(context);
  }
}
