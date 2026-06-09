import { writeFileSync } from 'fs';
import sh from 'shelljs';
import { throwOnError } from './sh-exec.js';
import { sparqlJsonToCsv } from './sparql-json2csv.js';

export function mergeTurtles(outputPath, _prefixesPath, ontologyPaths) {
  const tempJournal = `${outputPath}.jnl`;
  sh.rm('-f', tempJournal);

  const tempGraph = 'http://temp';
  const inputFiles = ontologyPaths.join(' ');
  throwOnError(
    `blazegraph-runner load --journal=${tempJournal} \
        --use-ontology-graph=false \
        --graph="${tempGraph}" \
        --informat=turtle ${inputFiles}`,
    `${inputFiles} failed to load`
  );
  throwOnError(
    `blazegraph-runner dump --journal=${tempJournal} \
        --graph="${tempGraph}" \
        --outformat=turtle ${outputPath}`,
    `${outputPath} failed to dump`
  );
  sh.rm('-f', tempJournal);
}

export function dump(graphName, journalPath, outputPath, format) {
  throwOnError(
    `blazegraph-runner dump --journal=${journalPath} \
        --graph="${graphName}" \
        --outformat=${format} ${outputPath}`,
    `Failed to dump ${graphName} graph.`
  );
}

export function load(graphName, inputPath, journalPath) {
  const sparqlUpdate = `
    CLEAR GRAPH <${graphName}> ;
    LOAD <file://${inputPath}> INTO GRAPH <${graphName}> ;
  `;
  const loadScript = `${journalPath}.temp`;
  writeFileSync(loadScript, sparqlUpdate);
  update(loadScript, journalPath);
  sh.rm('-f', loadScript);
}

export function construct(queryPath, outputPath, journalPath) {
  throwOnError(
    `blazegraph-runner construct --journal=${journalPath} ${queryPath} ${outputPath}`,
    `Failed to construct from ${queryPath}.`
  );
}

export async function select(queryPath, outputPath, journalPath) {
  throwOnError(
    `blazegraph-runner --outformat=json select --journal=${journalPath} ${queryPath} ${outputPath}.json`,
    `Failed to select from ${queryPath}.`
  );
  await sparqlJsonToCsv(`${outputPath}.json`, outputPath);
  sh.rm('-f', `${outputPath}.json`);
}

export function update(script, journalPath) {
  throwOnError(`blazegraph-runner update --journal=${journalPath} ${script}`, `Failed to update ${journalPath}.`);
}
