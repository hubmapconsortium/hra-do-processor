import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { lookup } from 'mime-types';
import { resolve } from 'path';
import { info } from '../utils/logging.js';
import { exec, throwOnError } from '../utils/sh-exec.js';
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
  return {
    ...generateGraphMetadata(context, metadata),
    was_derived_from: {
      ...generateRawMetadata(context, metadata)
    }
  }
}

function generateRawMetadata(context, metadata) {
  const datatable = metadata.datatable;
  delete metadata.datatable;
  metadata.creators = metadata.creators?.map((creator) => normalizePersonData(creator));
  metadata.project_leads = metadata.project_leads?.map((leader) => normalizePersonData(leader));
  metadata.reviewers = metadata.reviewers?.map((reviewer) => normalizePersonData(reviewer));
  metadata.externalReviewers = metadata.externalReviewers?.map((reviewer) => normalizePersonData(reviewer));
  return {
    id: `${getMetadataUrl(context)}#raw-data`,
    label: metadata.title,
    ...metadata,
    distributions: getRawDataDistributions(context, datatable)
  }
}

function normalizePersonData(person) {
  return {
    id: `https://orcid.org/${person.orcid}`,
    class_type: "Person",
    type_of: "schema:Person",
    label: person.fullName,
    ...person  
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
    label: `The ${type}/${name} ${version} graph data`,
    title: `The ${type}/${name} ${version} graph data`,
    description: `The graph representation of the ${metadata.title} dataset.`,
    version,
    creators: [{
      id: "https://github.com/hubmapconsortium/hra-do-processor",
      class_type: "SoftwareApplication",
      type_of: "schema:SoftwareApplication",
      label: "HRA Digital Object Processor",
      name: "HRA Digital Object Processor",
      version: getProcessorVersion(),
      target_product: {
        code_repository: getCodeRepository(),
        see_also: getCommitUrl()
      }
    }],
    creation_date: getTodayDate(),
    publisher: "HuBMAP",
    license: "https://creativecommons.org/licenses/by/4.0/",
    see_also: `${getMetadataUrl(context)}/`,
    distributions: getGraphDataDistributions(context)
  };
}

function getGraphDataDistributions(context) {
  const { selectedDigitalObject: obj } = context;
  const accessUrl = getMetadataUrl(context);
  return [
    {
      id: `${accessUrl}#turtle`,
      label: `The graph data distribution of '${obj.doString}' in Turtle format.`,
      title: `The graph data distribution of '${obj.doString}' in Turtle format.`,
      downloadUrl: getDataDownloadUrl(context, 'ttl'),
      accessUrl: `${accessUrl}#turtle`,
      mediaType: 'text/turtle',
    },
    {
      id: `${accessUrl}#jsonld`,
      label: `The graph data distribution of '${obj.doString}' in JSON-LD format.`,
      title: `The graph data distribution of '${obj.doString}' in JSON-LD format.`,
      downloadUrl: getDataDownloadUrl(context, 'json'),
      accessUrl: `${accessUrl}#jsonld`,
      mediaType: 'application/ld+json',
    },
    {
      id: `${accessUrl}#rdfxml`,
      label: `The graph data distribution of '${obj.doString}' in RDF/XML format.`,
      title: `The graph data distribution of '${obj.doString}' in RDF/XML format.`,
      downloadUrl: getDataDownloadUrl(context, 'xml'),
      accessUrl: `${accessUrl}#rdfxml`,
      mediaType: 'application/rdf+xml',
    },
    {
      id: `${accessUrl}#ntriples`,
      label: `The graph data distribution of '${obj.doString}' in N-Triples format.`,      
      title: `The graph data distribution of '${obj.doString}' in N-Triples format.`,
      downloadUrl: getDataDownloadUrl(context, 'nt'),
      accessUrl: `${accessUrl}#ntriples`,
      mediaType: 'application/n-triples',
    },
    {
      id: `${accessUrl}#nquads`,
      label: `The graph data distribution of '${obj.doString}' in N-Quads format.`,
      title: `The graph data distribution of '${obj.doString}' in N-Quads format.`,
      downloadUrl: getDataDownloadUrl(context, 'nq'),
      accessUrl: `${accessUrl}#nquads`,
      mediaType: 'application/n-quads',
    },
  ];
}

function getRawDataDistributions(context, datatable) {
  const { type, name, version } = context.selectedDigitalObject;
  const accessUrl = getMetadataUrl(context);
  return datatable.map((dataItem => {
    const fileExtension = ${dataItem.split('.').slice(-1).join('')};
    const downloadUrl = `${context.cdnIri}${type}/${name}/${version}/assets/${dataItem}`;
    return {
      id: `${accessUrl}#raw-data-${fileExtension}`,
      label: `The raw data distribution of '${dataItem} file.`
      title: `The raw data distribution of '${dataItem} file.`,
      downloadUrl,
      accessUrl: `${accessUrl}#raw-data-${fileExtension}`,
      mediaType: lookup(downloadUrl),
    };
  }))
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

function getProcessorVersion() {
  return exec("do-processor --version");
}

export function cleanDirectory(context) {
  const { selectedDigitalObject: obj } = context;
  const path = resolve(obj.path, 'normalized/');
  throwOnError(
    `find ${path} -type f -exec rm -f {} +`,
    'Clean normalized directory failed.'
  );
}
