import { throwOnError } from './sh-exec.js';
import { dump } from './blazegraph.js';

const FORMATS = {
  json: 'application/ld+json',
  nt: 'application/n-triples',
  xml: 'application/rdf+xml',
  nq: 'application/n-quads'
};

export function reifyDoTurtle(context, inputPath, journalPath) {
  const graphName = context.selectedDigitalObject.iri;
  reifyTurtle(inputPath, graphName, journalPath);
}

export function reifyRedundantTurtle(context, inputPath, journalPath) {
  const graphName = `${context.selectedDigitalObject.iri}/redundant`;
  reifyTurtle(inputPath, graphName, journalPath);
}

function reifyTurtle(inputPath, graphName, journalPath) {
  const basePath = inputPath.slice(0, inputPath.lastIndexOf('.'));
  for (const [extension, type] of Object.entries(FORMATS)) {
    if (extension === 'nq') {
      dump(graphName, journalPath, `${basePath}.${extension}`, 'nquads');
    } else {
      convert(inputPath, `${basePath}.${extension}`, type);
    }
  }
}

function convert(inputPath, outputPath, outputFormat) {
  throwOnError(
      `rdfpipe --output-format ${outputFormat} ${inputPath} > ${outputPath}`,
      `Failed to convert to '${outputFormat}' format.`
    );
}
