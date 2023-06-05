import { throwOnError } from './sh-exec.js';

const FORMATS = {
  json: 'application/ld+json',
  nt: 'application/n-triples',
  xml: 'application/rdf+xml',
};

export function reifyTurtle(context, inputPath, journal) {
  const graph = context.selectedDigitalObject.iri;
  const basePath = inputPath.slice(0, inputPath.lastIndexOf('.'));

  for (const [extension, type] of Object.entries(FORMATS)) {
    convert(inputPath, `${basePath}.${extension}`, type);
  }

  throwOnError(
    `blazegraph-runner dump --journal=${journal} \
        --graph="${graph}" \
        --outformat=nquads ${basePath}.nq`,
    `Failed to reify ${inputPath} to n-quads`
  );
}

export function convert(inputPath, outputPath, outputFormat) {
  throwOnError(
      `rdfpipe --output-format ${outputFormat} ${inputPath} > ${outputPath}`,
      `Failed to convert to '${outputFormat}'' format.`
    );
}
