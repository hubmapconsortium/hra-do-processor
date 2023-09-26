import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { lookup } from 'mime-types';
import { resolve } from 'path';
import { info } from '../utils/logging.js';

export function readMetadata(context) {
  const { path, type, name, version } = context.selectedDigitalObject;
  return {
    ...load(readFileSync(resolve(path, 'raw/metadata.yaml'))),
    type,
    name,
    version,
  };
}

export function readLocalData(context, fileName, parse) {
  const { path } = context.selectedDigitalObject;
  return parse(readFileSync(resolve(path, `raw/${fileName}`)));
}

export function writeNormalizedMetadata(context, metadata) {
  const { path } = context.selectedDigitalObject;
  const normalizedPath = resolve(path, 'normalized/normalized-metadata.yaml');
  writeFileSync(normalizedPath, dump(metadata));
  info(`Normalized metadata written to ${normalizedPath}`);
}

export function writeNormalizedData(context, data) {
  const { path, iri } = context.selectedDigitalObject;
  const rawMetadata = readMetadata(context);
  const metadata = {
    ...selectMetadata(rawMetadata),
    see_also: getMetadataIri(context),
  };
  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(normalizedPath, dump({ iri, metadata, data }));
  info(`Normalized digital object written to ${normalizedPath}`);
}

function selectMetadata({ title, description, creators, version, creation_date, license, publisher }) {
  return { title, description, creators, version, creation_date, license, publisher };
}

export function normalizeMetadata(context, metadata) {
  const datatable = normalizeDatatable(context, metadata.datatable);
  const normalizedMetadata = {
    iri: getMetadataIri(context),
    ...metadata,
    datatable,
    distributions: getDataDistributions(context).concat(getDataTableDistributions(context, datatable)),
  };
  delete normalizedMetadata.type;
  delete normalizedMetadata.name;
  return normalizedMetadata;
}

export function getDataDistributions(context) {
  const { selectedDigitalObject: obj } = context;
  const accessUrl = getMetadataIri(context);
  return [
    {
      title: `The data distribution of '${obj.doString}' in Turtle format.`,
      downloadUrl: getDataDownloadUrl(context, 'ttl'),
      accessUrl: accessUrl,
      mediaType: 'text/turtle',
    },
    {
      title: `The data distribution of '${obj.doString}' in JSON-LD format.`,
      downloadUrl: getDataDownloadUrl(context, 'json'),
      accessUrl: accessUrl,
      mediaType: 'application/ld+json',
    },
    {
      title: `The data distribution of '${obj.doString}' in RDF/XML format.`,
      downloadUrl: getDataDownloadUrl(context, 'xml'),
      accessUrl: accessUrl,
      mediaType: 'application/rdf+xml',
    },
    {
      title: `The data distribution of '${obj.doString}' in N-Triples format.`,
      downloadUrl: getDataDownloadUrl(context, 'nt'),
      accessUrl: accessUrl,
      mediaType: 'application/n-triples',
    },
    {
      title: `The data distribution of '${obj.doString}' in N-Quads format.`,
      downloadUrl: getDataDownloadUrl(context, 'nquads'),
      accessUrl: accessUrl,
      mediaType: 'application/n-quads',
    },
  ];
}

export function normalizeDatatable(context, datatable) {
  const { type, name, version } = context.selectedDigitalObject;
  return datatable.map((item) => `${context.cdnIri}${type}/${name}/${version}/assets/${item}`);
}

export function getDataTableDistributions(context, urls) {
  const { selectedDigitalObject: obj } = context;
  const accessUrl = getMetadataIri(context);
  return urls.map((url) => {
    return {
      title: `A raw source distriution of '${obj.doString}' in .${url.split('.').slice(-1).join('')} format.`,
      downloadUrl: url,
      accessUrl,
      mediaType: lookup(url),
    };
  });
}

export function getMetadataIri(context) {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.lodIri}${type}/${name}/${version}`;
}

function getDataDownloadUrl(context, format = 'ttl') {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.cdnIri}${type}/${name}/${version}/graph.${format}`;
}
