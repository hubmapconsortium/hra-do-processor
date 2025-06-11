import { writeFileSync } from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { load, update } from '../utils/blazegraph.js';
import { getDeployedDigitalObjects, getRedundantGraph } from './utils.js';

/**
 *
 * @param {object} context
 */
export function buildBlazegraphJournal(context) {
  const digitalObjects = getDeployedDigitalObjects(context, false);
  const journal = context.journal ?? resolve(context.deploymentHome, 'blazegraph.jnl');
  sh.rm('-f', journal);
  const incremental = context.includeAllVersions;

  let sparqlUpdate = '';

  const digitalObjectsToDeploy = digitalObjects.filter(
    (o) => context.includeAllVersions || o.version === 'latest' || o.version === 'draft'
  );

  for (const obj of digitalObjectsToDeploy) {
    let doString = obj.doString;
    if (obj.version === 'latest') {
      doString = `${obj.type}/${obj.name}`;
    }
    const iri = `${context.purlIri}${doString}`;
    const graph = resolve(context.deploymentHome, obj.doString, 'graph.ttl');

    if (incremental) {
      load(iri, graph, journal);
    } else {
      sparqlUpdate += `LOAD <file://${graph}> INTO GRAPH <${iri}>;\n`;
    }

    const redundant = getRedundantGraph(context, obj);
    if (redundant) {
      const redundantIri = `${iri}/redundant`;
      if (incremental) {
        load(redundantIri, redundant, journal);
      } else {
        sparqlUpdate += `LOAD <file://${redundant}> INTO GRAPH <${redundantIri}>;\n`;
      }
    }
  }

  const catalog = resolve(context.deploymentHome, 'catalog.ttl');
  const catalogGraph = context.purlIri.replace(/\/$/, '');
  if (incremental) {
    load(catalogGraph, catalog, journal);
  } else {
    sparqlUpdate += `LOAD <file://${catalog}> INTO GRAPH <${catalogGraph}>;\n`;
  }

  // Deprecated: The catalog should now be referred to as https://purl.humanatlas.io ie purlIri
  const catalogGraph2 = 'https://lod.humanatlas.io';
  if (incremental) {
    load(catalogGraph2, catalog, journal);
  } else {
    sparqlUpdate += `LOAD <file://${catalog}> INTO GRAPH <${catalogGraph2}>;\n`;
  }

  if (!incremental) {
    const loadScript = resolve(context.deploymentHome, 'blazegraph.load.rq');
    writeFileSync(loadScript, sparqlUpdate);
    update(loadScript, journal);
    sh.rm('-f', loadScript);
  }
}
