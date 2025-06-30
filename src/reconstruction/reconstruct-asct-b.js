import { resolve } from 'path';
import { info, error } from '../utils/logging.js';
import { executeBlazegraphQuery, loadGraph } from './utils.js';

export function reconstructAsctb(context) {
  try {   
    loadGraph(context);
    queryGraph(context);

    info('ASCT-B reconstruction completed successfully');
  } catch (err) {
    error('Error during ASCT-B reconstruction:', err);
    throw err;
  }
}

function queryGraph(context) {
  try {
    const processorHome = resolve(context.processorHome);
    const reconstructPath = resolve(context.reconstructionHome);
    const journalPath = resolve(reconstructPath, 'blazegraph.jnl');
    const queryPath = resolve(processorHome, 'src/reconstruction/queries/get-asct-b-records.rq');
    const outputPath = resolve(reconstructPath, 'records.tsv');

    executeBlazegraphQuery(journalPath, queryPath, outputPath);
    
    info('Graph query completed successfully');
  } catch (err) {
    error('Error during graph query:', err);
    throw err;
  }
}
