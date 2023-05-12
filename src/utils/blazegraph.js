import { resolve } from 'path';
import sh from 'shelljs';
import { throwOnError } from './sh-exec.js';

export function mergeTurtles(outputPath, _prefixesPath, ontologyPaths) {
  const tempJournal = `${outputPath}.jnl`;
  sh.rm('-f', tempJournal);

  const tempGraph = 'http://temp';
  const inputFiles = ontologyPaths.join(' ');
  throwOnError(
    `blazegraph-runner load --journal=${tempJournal} --use-ontology-graph=false --graph="${tempGraph}" --informat=turtle ${inputFiles}`,
    `${inputFiles} failed to load`
  );

  throwOnError(
    `blazegraph-runner dump --journal=${tempJournal} --graph="${tempGraph}" --outformat=turtle ${outputPath}`,
    `${outputPath} failed to dump`
  );
  sh.rm('-f', tempJournal);
}

export function loadDoIntoTripleStore(context, journalPath) {
  const obj = context.selectedDigitalObject;
  const graph = obj.iri;
  const data = resolve(obj.path, 'enriched/enriched.ttl');
  throwOnError(
    `owl-cli write -i turtle -o ntriple ${data} ${journalPath}.temp && blazegraph-runner load --journal=${journalPath} --use-ontology-graph=false --graph="${graph}" --informat=ntriples ${journalPath}.temp && rm -f ${journalPath}.temp`,
    `${data} failed to load`
  );
}
