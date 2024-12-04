import { writeFileSync } from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';
import { update } from '../utils/blazegraph.js';
import { getDeployedDigitalObjects, getRedundantGraph } from './utils.js';

/**
 *
 * @param {object} context
 */
export function buildBlazegraphJournal(context) {
  const digitalObjects = getDeployedDigitalObjects(context, false);
  const journal = context.journal ?? resolve(context.deploymentHome, 'blazegraph.jnl');
  sh.rm('-f', journal);

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
    sparqlUpdate += `LOAD <file://${graph}> INTO GRAPH <${iri}>;\n`;

    const redundant = getRedundantGraph(context, obj);
    if (redundant) {
      const redundantIri = `${iri}/redundant`;
      sparqlUpdate += `LOAD <file://${redundant}> INTO GRAPH <${redundantIri}>;\n`;
    }
  }

  const catalog = resolve(context.deploymentHome, 'catalog.ttl');
  const catalogGraph = context.lodIri.replace(/\/$/, '');
  sparqlUpdate += `LOAD <file://${catalog}> INTO GRAPH <${catalogGraph}>;\n`;

  const loadScript = resolve(context.deploymentHome, 'blazegraph.load.rq');
  writeFileSync(loadScript, sparqlUpdate);
  update(loadScript, journal);

  sh.rm('-f', loadScript);
}
