import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { lookup } from 'mime-types';
import { resolve } from 'path';
import { info } from '../utils/logging.js';
import { exec, throwOnError } from '../utils/sh-exec.js';
import { getCodeRepository, getCommitUrl } from '../utils/git.js';
import { ReferenceExtractor } from './reference-extractor/reference-extractor.js';
import { DOIExtractor } from './reference-extractor/doi-extractor.js';
import { BioRxivExtractor } from './reference-extractor/biorxiv-extractor.js';
import { get } from 'http';

export function readMetadata(context) {
  const { path } = context.selectedDigitalObject;
  return {
    ...load(readFileSync(resolve(path, 'raw/metadata.yaml'))),
  };
}

export function readNormalizedMetadata(context) {
  const { path } = context.selectedDigitalObject;
  return {
    ...load(readFileSync(resolve(path, 'normalized/normalized-metadata.yaml'))),
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
    see_also: metadata.id
  };
  if (metadata.was_derived_from) {
    output.derived_from = metadata.was_derived_from.id;
  }
  if (metadata.ontology_root) {
    output.ontology_root = metadata.ontology_root;
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
  delete metadata.ontologyRoot;
  delete metadata.datatable;
  metadata.creators = metadata.creators?.map((creator) => normalizePersonData(creator));
  metadata.project_leads = metadata.project_leads?.map((leader) => normalizePersonData(leader));
  metadata.reviewers = metadata.reviewers?.map((reviewer) => normalizePersonData(reviewer));
  metadata.externalReviewers = metadata.externalReviewers?.map((reviewer) => normalizePersonData(reviewer));
  return {
    id: `${getMetadataUrl(context)}#raw-data`,
    label: metadata.title,
    ...metadata,
    distributions: getRawDataDistributions(context, datatable),
    references: removeDuplicateStrings([
      ...(metadata.references || []), 
      ...getRawDataReferences(context, metadata.description)
    ]),
  }
}

function normalizePersonData(person) {
  return {
    id: `https://orcid.org/${person.orcid}`,
    conforms_to: "Person",
    type_of: ["schema:Person"],
    label: person.fullName,
    ...person
  }
}

export function normalizeMetadataOfCollection(context, metadata, doList) {
  return {
    ...normalizeMetadata(context, structuredClone(metadata)),
    ontology_root: metadata.ontologyRoot,
    had_member: doList.map((doItem) => `https://purl.humanatlas.io/${doItem}`)
  };
}

function generateGraphMetadata(context, metadata) {
  const { type, name, version } = context.selectedDigitalObject;
  const processorHome = context.processorHome;
  return {
    id: getMetadataUrl(context),
    type,
    name,
    label: getGraphTitle(name, version),
    title: getGraphTitle(name, version),
    description: `The graph representation of the ${metadata.title} dataset.`,
    version,
    creators: [{
      id: "https://github.com/hubmapconsortium/hra-do-processor",
      conforms_to: "SoftwareApplication",
      type_of: ["schema:SoftwareApplication"],
      label: "HRA Digital Object Processor",
      name: "HRA Digital Object Processor",
      version: getProcessorVersion(),
      target_product: {
        code_repository: getCodeRepository(processorHome),
        see_also: getCommitUrl(processorHome)
      }
    }],
    creation_date: getTodayDate(),
    publisher: "HuBMAP",
    license: "https://creativecommons.org/licenses/by/4.0/",
    see_also: getDatasetIri(context),
    distributions: getGraphDataDistributions(context)
  };
}

function getGraphTitle(name, version) {
  return `${name} (${version}) graph data`;
}

function getGraphDataDistributions(context) {
  const { iri, type, name, version } = context.selectedDigitalObject;
  const accessUrl = getMetadataUrl(context);
  return [
    {
      id: `${accessUrl}#json`,
      label: getGraphDataDistributionTitle(name, version, "JSON"),
      title: getGraphDataDistributionTitle(name, version, "JSON"),
      downloadUrl: getDataDownloadUrl(context, 'json'),
      accessUrl: `${accessUrl}#json`,
      mediaType: 'application/json',
    },
    {
      id: `${accessUrl}#turtle`,
      label: getGraphDataDistributionTitle(name, version, "Turtle"),
      title: getGraphDataDistributionTitle(name, version, "Turtle"),
      downloadUrl: getDataDownloadUrl(context, 'ttl'),
      accessUrl: `${accessUrl}#turtle`,
      mediaType: 'text/turtle',
    },
    {
      id: `${accessUrl}#jsonld`,
      label: getGraphDataDistributionTitle(name, version, "JSON-LD"),
      title: getGraphDataDistributionTitle(name, version, "JSON-LD"),
      downloadUrl: getDataDownloadUrl(context, 'jsonld'),
      accessUrl: `${accessUrl}#jsonld`,
      mediaType: 'application/ld+json',
    },
    {
      id: `${accessUrl}#rdfxml`,
      label: getGraphDataDistributionTitle(name, version, "RDF/XML"),
      title: getGraphDataDistributionTitle(name, version, "RDF/XML"),
      downloadUrl: getDataDownloadUrl(context, 'xml'),
      accessUrl: `${accessUrl}#rdfxml`,
      mediaType: 'application/rdf+xml',
    },
    {
      id: `${accessUrl}#ntriples`,
      label: getGraphDataDistributionTitle(name, version, "N-Triples"),
      title: getGraphDataDistributionTitle(name, version, "N-Triples"),
      downloadUrl: getDataDownloadUrl(context, 'nt'),
      accessUrl: `${accessUrl}#ntriples`,
      mediaType: 'application/n-triples',
    },
    {
      id: `${accessUrl}#nquads`,
      label: getGraphDataDistributionTitle(name, version, "N-Quads"),
      title: getGraphDataDistributionTitle(name, version, "N-Quads"),
      downloadUrl: getDataDownloadUrl(context, 'nq'),
      accessUrl: `${accessUrl}#nquads`,
      mediaType: 'application/n-quads',
    },
  ];
}

function getGraphDataDistributionTitle(name, version, format) {
  return `Graph data distribution ${name} (${version}) in ${format} format`
}

function getRawDataDistributions(context, datatable) {
  const { type, name, version } = context.selectedDigitalObject;
  const accessUrl = getMetadataUrl(context);
  return datatable.map((dataItem => {
    const fileExtension = dataItem.split('.').slice(-1).join('');
    const downloadUrl = `${context.cdnIri}${type}/${name}/${version}/assets/${dataItem}`;
    return {
      id: `${accessUrl}#${dataItem}`,
      label: `Raw data distribution '${dataItem}' file`,
      title: `Raw data distribution '${dataItem}' file`,
      downloadUrl,
      accessUrl: `${accessUrl}#${dataItem}`,
      mediaType: lookup(downloadUrl),
    };
  }))
}

function getRawDataReferences(context, description) {
  const extractor = new ReferenceExtractor();
  extractor.registerStrategy('doi', new DOIExtractor());
  extractor.registerStrategy('biorxiv', new BioRxivExtractor());

  return extractor.extract(description);
}

function getDatasetIri(context) {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.purlIri}${type}/${name}/${version}`;
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

export function removeDuplicate(data, distinctProperties) {
  return data.filter((value, index, self) =>
    self.findIndex(v => distinctProperties.every(k => v[k] === value[k])) === index
  );
}

export function removeDuplicateStrings(strings) {
  return [...new Set(strings)];
}
