import { buildBlazegraphJournal } from './finalizing/build-blazegraph.js';

export function createDb(context) {
  buildBlazegraphJournal(context);
}
