import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import Papa from 'papaparse';
import { info, more, warning } from '../utils/logging.js';
import {
  readMetadata,
  readLocalData,
  writeNormalizedMetadata,
  writeNormalizedData,
  getMetadataIri,
  getDataDistributions 
} from './utils.js';

export function normalize2dFtuMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

function normalizeMetadata(context, metadata) {
  const normalizedMetadata = {
    iri: getMetadataIri(context),
    ...metadata,
    datatable: normalizeDatatable(context, metadata.datatable),
    distributions: getDataDistributions(context)
  };
  delete normalizedMetadata.type;
  delete normalizedMetadata.name;
  return normalizedMetadata;
}

function normalizeDatatable(context, datatable) {
  const { type, name, version } = context.selectedDigitalObject;
  return datatable.map(item => `https://cdn.humanatlast.io/digital-objects/${type}/${name}/${version}/${item}`)
}

export async function normalize2dFtuData(context) {
  const rawData = await getRawData(context);
  const rawMetadata = readMetadata(context);
  const normalizedData = normalizeData(context, rawMetadata, rawData);
  writeNormalizedData(context, normalizedData);
}

async function getRawData(context) {
  const crosswalk = readLocalData(context, "crosswalk.csv",
    (csvData) => Papa.parse(
      csvData.toString(), {
        header: true, 
        skipEmptyLines: true
      }));
  return crosswalk.data;
}

function normalizeData(context, metadata, data) {
  const { iri, name } = context.selectedDigitalObject;
  const illustrationName = name.replace(/-/g, " ");
  const illustrationRepresentation = data[0]['tissue_mapped_to'];
  return [{
      id: `${iri}#illustration`,
      label: `An illustration of ${illustrationName}`,
      class_type: 'FtuIllustration',
      typeOf: [ 'FtuIllustration', illustrationRepresentation ],
      located_in: data[0]['organ_mapped_to'],
      image_file: normalizeIllustrationImage(context, metadata),
      illustration_node: normalizeIllustrationNode(context, data)
    }];
}

function normalizeIllustrationImage(context, metadata) {
  const { iri, type, name, version } = context.selectedDigitalObject;
  const datatable = metadata['datatable'];
  return datatable.filter(item => item.split('.').pop() != "csv")
    .map(item => {
      const fileType = item.split('.').pop();
      const fileTypeName = fileType.toUpperCase();
      const illustrationName = name.replace(/-/g, " ");
      return {
        id: `${iri}#${fileType}`,
        label: `${fileTypeName} image of ${illustrationName}`,
        class_type: 'FtuIllustrationFile',
        typeOf: [ 'FtuIllustrationFile' ],
        file_url: `https://cdn.humanatlast.io/digital-objects/${type}/${name}/${version}/${item}`,
        file_format: getMimeType(fileType)
      }
  });
}

function getMimeType(fileType) {
  if (fileType === 'svg') {
    return 'image/svg+xml';
  } else if (fileType === 'ai') {
    return 'application/pdf';
  } else if (fileType === 'png') {
    return 'image/png';
  } else {
    return 'image/other';
  }
}

function normalizeIllustrationNode(context, data) {
  const { iri } = context.selectedDigitalObject;
  return data.map(item => {
    const nodeId = item['node_id'];
    const nodeLabel = item['node_id'].replace(/_/g, " ").toLowerCase();
    const nodeRepresentation = item['node_mapped_to'];
    return {
      id: `${iri}#${nodeId}`,
      label: `An illustration node of ${nodeLabel}`,
      class_type: 'FtuIllustrationNode',
      typeOf: [ 'FtuIllustrationNode', nodeRepresentation ],
      node_name: nodeId,
      part_of_illustration: `${iri}#illustration`
    }
  });
}
