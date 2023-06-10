import { resolve } from 'path';
import sh from 'shelljs';
import { throwOnError } from './sh-exec.js';

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
  throwOnError(
    `owl-cli write -i turtle -o ntriple ${inputPath} ${journalPath}.temp && \
     blazegraph-runner load --journal=${journalPath} \
        --use-ontology-graph=false \
        --graph="${graphName}" \
        --informat=ntriples ${journalPath}.temp && \
     rm -f ${journalPath}.temp`,
    `File ${inputPath} failed to load.`
  );
}
