import { resolve } from 'path';
import sh from 'shelljs';
import { info } from './logging.js';
import { throwOnError } from './sh-exec.js';

const FORMATS = {
  jsonld: 'application/ld+json',
  nt: 'application/n-triples',
  xml: 'application/rdf+xml',
  nq: 'application/n-quads',
};

export const RDF_EXTENSIONS = new Set([
  'json',
  'jsonld',
  'json-ld',
  'nt',
  'xml',
  'rdf',
  'nq',
  'n3',
  'owl',
  'trig',
  'turtle',
]);

export const JSONLD_EXTENSIONS = new Set(['json', 'jsonld', 'json-ld']);

export function isJsonLd(fileOrUrl) {
  const extension = fileOrUrl.split('.').slice(-1)[0];
  return JSONLD_EXTENSIONS.has(extension);
}

export function reifyDoTurtle(context, inputPath) {
  const graphName = context.selectedDigitalObject.iri;
  reifyTurtle(inputPath, graphName, false);
}

export function reifyMetadataTurtle(context, inputPath) {
  const graphName = `${context.lodIri}${context.selectedDigitalObject.doString}`;
  reifyTurtle(inputPath, graphName, true);
}

export function reifyRedundantTurtle(context, inputPath) {
  const graphName = `${context.selectedDigitalObject.iri}/redundant`;
  reifyTurtle(inputPath, graphName, true);
}

export function reifyCatalog(context, graphName, catalog) {
  const catalogPath = resolve(context.deploymentHome, catalog, 'index.html');
  const inputPath = resolve(context.deploymentHome, catalog, 'metadata.ttl');
  info(`Reifying ${graphName}`);
  throwOnError(
    `rdf-formatter ${catalogPath} ${inputPath} --pretty \
    --ns=dcat=http://www.w3.org/ns/dcat# \
    --ns=dc=http://purl.org/dc/terms/ `,
    `Unable to convert catalog ${catalogPath}`
  );
  reifyTurtle(inputPath, graphName, true);
}

export function reifyTurtle(inputPath, graphName, jsonldIsJson = false) {
  const basePath = inputPath.slice(0, inputPath.lastIndexOf('.'));
  for (const [extension, type] of Object.entries(FORMATS)) {
    convert(inputPath, `${basePath}.${extension}`, type, graphName);
  }
  if (jsonldIsJson) {
    sh.cp(`${basePath}.jsonld`, `${basePath}.json`);
  }
}

export function convert(inputPath, outputPath, outputFormat, graphName) {
  let command = `rdfpipe --output-format ${outputFormat} ${inputPath}`;
  if (isJsonLd(inputPath)) {
    command = `cat ${inputPath} | jsonld expand | rdfpipe --input-format json-ld --output-format ${outputFormat} -`;
  }
  if (graphName && outputFormat === 'application/n-quads') {
    command += ` | perl -pe 's|\\Qfile://${inputPath}\\E|${graphName}|g'`;
  }
  throwOnError(`${command} > ${outputPath}`, `Failed to convert to '${outputFormat}' format.`);
}
