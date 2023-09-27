import { throwOnError } from './sh-exec.js';

const FORMATS = {
  json: 'application/ld+json',
  nt: 'application/n-triples',
  xml: 'application/rdf+xml',
  nq: 'application/n-quads'
};

export function reifyDoTurtle(context, inputPath) {
  const graphName = context.selectedDigitalObject.iri;
  reifyTurtle(inputPath, graphName);
}

export function reifyMetadataTurtle(context, inputPath) {
  const graphName = `${context.lodIri}${context.selectedDigitalObject.doString}`;
  reifyTurtle(inputPath, graphName);
}

export function reifyRedundantTurtle(context, inputPath) {
  const graphName = `${context.selectedDigitalObject.iri}/redundant`;
  reifyTurtle(inputPath, graphName);
}

function reifyTurtle(inputPath, graphName) {
  const basePath = inputPath.slice(0, inputPath.lastIndexOf('.'));
  for (const [extension, type] of Object.entries(FORMATS)) {
    convert(inputPath, `${basePath}.${extension}`, type, graphName);
  }
}

function convert(inputPath, outputPath, outputFormat, graphName) {
  if (graphName && outputFormat === 'application/n-quads') {
    throwOnError(
      `rdfpipe --output-format ${outputFormat} ${inputPath} | \\
          perl -pe 's|\\Qfile://${inputPath}\\E|${graphName}|g' \\
          > ${outputPath}`,
      `Failed to fix n-quads file: ${outputPath}`
    )
  } else {
    throwOnError(
      `rdfpipe --output-format ${outputFormat} ${inputPath} > ${outputPath}`,
      `Failed to convert to '${outputFormat}' format.`
    );
  }
}
