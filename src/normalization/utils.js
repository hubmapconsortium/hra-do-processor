import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { lookup } from 'mime-types';
import { resolve } from 'path';
import { info } from '../utils/logging.js';
import { throwOnError } from '../utils/sh-exec.js';
import { getVersionTag, getCodeRepository, getCommitUrl } from '../utils/git.js';

export function readMetadata(context) {
  const { path } = context.selectedDigitalObject;
  return {
    ...load(readFileSync(resolve(path, 'raw/metadata.yaml'))),
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

export function writeNormalizedMetadataOfCollection(context, metadata) {
  writeNormalizedMetadata(context, metadata);
}

export function writeNormalizedData(context, data) {
  const { iri, path } = context.selectedDigitalObject;
  const metadata = flatten(normalizeMetadata(context, readMetadata(context)));
  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(normalizedPath, dump({ iri, metadata, data }));
  info(`Normalized digital object written to ${normalizedPath}`);
}

export function writeNormalizedDataOfCollection(context, data) {
  const { iri, path } = context.selectedDigitalObject;
  const metadata = flatten(normalizeMetadataOfCollection(context, readMetadata(context), data));
  const normalizedPath = resolve(path, 'normalized/normalized.yaml');
  writeFileSync(normalizedPath, dump({ iri, metadata, data }));
  info(`Normalized digital object written to ${normalizedPath}`);
}

function flatten(metadata) {
  const output = { 
    title: metadata.title, 
    description: metadata.description, 
    created_by: metadata.creators.map((creator) => creator.id),
    creation_date: metadata.creation_date, 
    version: metadata.version,
    license: metadata.license, 
    publisher: metadata.publisher, 
    see_also: metadata.see_also
  };
  if (metadata.was_derived_from) {
    output.derived_from = metadata.was_derived_from.id;
  }
  if (metadata.had_member) {
    output.had_member = metadata.had_member;
  }
  return output;
}

export function normalizeMetadata(context, metadata) {
  const { iri } = context.selectedDigitalObject;  
  const datatable = metadata.datatable;
  delete metadata.datatable;
  metadata.creators = metadata.creators?.map((creator) => ({
      id: `https://orcid.org/${creator.orcid}`,
      class_type: "Person",
      type_of: "schema:Person",
      ...creator
    }));
  metadata.project_leads = metadata.project_leads?.map((leader) => ({
    id: `https://orcid.org/${leader.orcid}`,
    class_type: "Person",
    type_of: "schema:Person",
    ...leader
  }))
  metadata.reviewers = metadata.reviewers?.map((reviewer) => ({
    id: `https://orcid.org/${reviewer.orcid}`,
    class_type: "Person",
    type_of: "schema:Person",
    ...reviewer
  }))
  metadata.externalReviewers = metadata.externalReviewers?.map((reviewer) => ({
    id: `https://orcid.org/${reviewer.orcid}`,
    class_type: "Person",
    type_of: "schema:Person",
    ...reviewer    
  }))
  return {
    ...generateGraphMetadata(context, metadata),
    was_derived_from: {
      id: `${getMetadataUrl(context)}#raw-data`,
      ...metadata,
      distributions: getDataTableDistributions(context, datatable)
    }
  }
}

export function normalizeMetadataOfCollection(context, metadata, doList) {
  return {
    ...normalizeMetadata(context, metadata),
    had_member: doList.map((doItem) => `https://purl.humanatlas.io/${doItem}`)
  };
}

function generateGraphMetadata(context, metadata) {
  const { iri, type, name, version } = context.selectedDigitalObject;
  return {
    id: iri,
    type,
    name,
    title: `The ${type}/${name} ${version} graph data`,
    description: `The graph representation of the ${metadata.title} dataset.`,
    version,
    creators: [{
      id: "https://github.com/hubmapconsortium/hra-do-processor",
      class_type: "SoftwareApplication",
      type_of: "schema:SoftwareApplication",
      name: "HRA Digital Object Processor",
      version: getVersionTag(),
      target_product: {
        code_repository: getCodeRepository(),
        see_also: getCommitUrl()
      }
    }],
    creation_date: getTodayDate(),
    publisher: "HuBMAP",
    license: "https://creativecommons.org/licenses/by/4.0/",
    see_also: getMetadataUrl(context),
    distributions: getDataDistributions(context)
  };
}

function getDataDistributions(context) {
  const { selectedDigitalObject: obj } = context;
  const accessUrl = getMetadataUrl(context);
  return [
    {
      title: `The data distribution of '${obj.doString}' in Turtle format.`,
      downloadUrl: getDataDownloadUrl(context, 'ttl'),
      accessUrl: `${accessUrl}#turtle`,
      mediaType: 'text/turtle',
    },
    {
      title: `The data distribution of '${obj.doString}' in JSON-LD format.`,
      downloadUrl: getDataDownloadUrl(context, 'json'),
      accessUrl: `${accessUrl}#jsonld`,
      mediaType: 'application/ld+json',
    },
    {
      title: `The data distribution of '${obj.doString}' in RDF/XML format.`,
      downloadUrl: getDataDownloadUrl(context, 'xml'),
      accessUrl: `${accessUrl}#rdfxml`,
      mediaType: 'application/rdf+xml',
    },
    {
      title: `The data distribution of '${obj.doString}' in N-Triples format.`,
      downloadUrl: getDataDownloadUrl(context, 'nt'),
      accessUrl: `${accessUrl}#ntriples`,
      mediaType: 'application/n-triples',
    },
    {
      title: `The data distribution of '${obj.doString}' in N-Quads format.`,
      downloadUrl: getDataDownloadUrl(context, 'nq'),
      accessUrl: `${accessUrl}#nquads`,
      mediaType: 'application/n-quads',
    },
  ];
}

function getDatatableUrls(context, datatable) {
  const { type, name, version } = context.selectedDigitalObject;
  return datatable.map((item) => `${context.cdnIri}${type}/${name}/${version}/assets/${item}`);
}

function getDataTableDistributions(context, datatable) {
  const { selectedDigitalObject: obj } = context;
  const accessUrl = getMetadataUrl(context);
  return getDatatableUrls(context, datatable).map((url) => {
    return {
      title: `The raw data distribution of '${obj.doString}' in .${url.split('.').slice(-1).join('')} format.`,
      downloadUrl: url,
      accessUrl,
      mediaType: lookup(url),
    };
  });
}

function getMetadataUrl(context) {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.lodIri}${type}/${name}/${version}`;
}

function getDataDownloadUrl(context, format = 'ttl') {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.cdnIri}${type}/${name}/${version}/graph.${format}`;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function cleanDirectory(context) {
  const { selectedDigitalObject: obj } = context;
  const path = resolve(obj.path, 'normalized/');
  throwOnError(
    `find ${path} -type f -exec rm -f {} +`,
    'Clean normalized directory failed.'
  );
}
