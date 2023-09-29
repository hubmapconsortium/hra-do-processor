import { buildBlazegraphJournal } from './build-blazegraph.js';
import { createCatalogs } from './create-catalogs.js';
import { deriveLatest } from './derive-latest.js';

/**
 * Driver function which runs after completing a round of deployments. This function
 * runs a set of codes to process the deployment home in preparation for final deployment
 * to a server.
 *
 * @param {object} context
 */
export function finalize(context) {
  deriveLatest(context);
  createCatalogs(context);
  if (!context.skipDb) {
    buildBlazegraphJournal(context);
  }
}
