import { readFileSync, writeFileSync } from 'fs';
import { Environment } from 'nunjucks';
import { resolve } from 'path';

// TODO: Factor these properties out
const TYPE_MAPPINGS = {
  cite_model_mappings: { 'asct-b': 'Data Table', '2d-ftu': '2D Data', omap: 'OMAP Tables', 'ref-organ': '3D Data' }
};

export function renderReadmeMd(templateFile, context, metadata) {
  const env = new Environment(undefined, { autoescape: false });

  env.addFilter('fileType', (mediaType) => {
    switch (mediaType) {
      case 'text/turtle': return 'Turtle';
      case 'application/ld+json': return 'JSON-LD';
      case 'application/rdf+xml': return 'RDF/XML';
      case 'application/n-triples': return 'N-Triples';
      case 'application/n-quads': return 'N-Quads';
    }
  });
  env.addFilter('pageId', (mediaType) => {
    switch (mediaType) {
      case 'text/turtle': return 'turtle';
      case 'application/ld+json': return 'jsonld';
      case 'application/rdf+xml': return 'rdfxml';
      case 'application/n-triples': return 'ntriples';
      case 'application/n-quads': return 'nquads';
    }
  });
  const template = readFileSync(templateFile).toString();
  return env.renderString(template, { ...TYPE_MAPPINGS, ...metadata, ...context.selectedDigitalObject });
}

export function writeReadmeMd(context, metadata) {
  const obj = context.selectedDigitalObject;
  const templateFile = resolve(context.processorHome, 'src/finalizing/templates/readme-md.njk');
  const mdString = renderReadmeMd(templateFile, context, metadata);
  const mdFile = resolve(context.deploymentHome, obj.doString, 'README.md');
  writeFileSync(mdFile, mdString);
}
