import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';
import { info } from '../utils/logging.js';

export function readMetadata(context) {
  const { path, type, name, version } = context.selectedDigitalObject;
  return {
    ...load(readFileSync(resolve(path, 'raw/metadata.yaml'))),
    type, name, version
  }
}

export function writeNormalizedMetadata(context, metadata) {
  const { path } = context.selectedDigitalObject;
  const normalizedPath = resolve(path, 'normalized/normalized-metadata.yaml');
  writeFileSync(
    normalizedPath,
    dump(metadata)
  );
  info(`Normalized metadata written to ${normalizedPath}`);
}

export function writeNormalizedData(context, data) {
  const { path, iri } = context.selectedDigitalObject;
  const metadata = selectMetadata(readMetadata(context));

  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(
    normalizedPath,
    dump({ iri, metadata, data })
  );
  info(`Normalized digital object written to ${normalizedPath}`);
}

function selectMetadata({title, description, creators, version, creation_date, license, publisher }) {
  return { title, description, creators, version, creation_date, license, publisher };
}

export function getDataDistributions(context) {
  const { selectedDigitalObject: obj } = context;
  const accessUrl = getMetadataIri(context);
  return [{
      title: `The data distribution of '${obj.doString}' in Turtle format.`,
      downloadUrl: getDataDownloadUrl(context, 'ttl'),
      accessUrl: accessUrl,
      mediaType: "text/turtle"
    }, {
      title: `The data distribution of '${obj.doString}' in JSON-LD format.`,
      downloadUrl: getDataDownloadUrl(context, 'json'),
      accessUrl: accessUrl,
      mediaType: "application/ld+json"
    }, {
      title: `The data distribution of '${obj.doString}' in RDF/XML format.`,
      downloadUrl: getDataDownloadUrl(context, 'xml'),
      accessUrl: accessUrl,
      mediaType: "application/rdf+xml"
    }, {
      title: `The data distribution of '${obj.doString}' in N-Triples format.`,
      downloadUrl: getDataDownloadUrl(context, 'nt'),
      accessUrl: accessUrl,
      mediaType: "application/n-triples"
    }, {
      title: `The data distribution of '${obj.doString}' in N-Quads format.`,
      downloadUrl: getDataDownloadUrl(context, 'nquads'),
      accessUrl: accessUrl,
      mediaType: "application/n-quads"
    }];
}

export function getMetadataIri(context) {
  const { type, name, version } = context.selectedDigitalObject;
  return `https://lod.humanatlas.io/${type}/${name}/${version}`;
}

function getDataDownloadUrl(context, format='ttl') {
  const { type, name, version } = context.selectedDigitalObject;
  return `https://cdn.humanatlas.io/digital-objects/${type}/${name}/${version}/graph.${format}`;
}

