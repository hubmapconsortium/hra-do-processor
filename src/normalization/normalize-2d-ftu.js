import Papa from 'papaparse';
import {
  normalizeMetadata,
  readLocalData,
  readMetadata,
  writeNormalizedData,
  writeNormalizedMetadata,
} from './utils.js';

export function normalize2dFtuMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalize2dFtuData(context) {
  const rawData = await getRawData(context);
  const rawMetadata = readMetadata(context);
  const normalizedData = normalizeData(context, rawMetadata, rawData);
  writeNormalizedData(context, normalizedData);
}

async function getRawData(context) {
  const crosswalk = readLocalData(context, 'crosswalk.csv', (csvData) =>
    Papa.parse(csvData.toString(), {
      header: true,
      skipEmptyLines: true,
    })
  );
  return crosswalk.data;
}

function normalizeData(context, metadata, data) {
  const { iri, name } = context.selectedDigitalObject;
  const illustrationName = name.replace(/-/g, ' ');
  const illustrationRepresentation = data[0]['tissue_mapped_to'];
  return [
    {
      id: `${iri}#primary`,
      label: `An illustration of ${illustrationName}`,
      type_of: ['ccf:FtuIllustration', illustrationRepresentation],
      located_in: data[0]['organ_mapped_to'],
      image_file: normalizeIllustrationImage(context, metadata),
      illustration_node: normalizeIllustrationNode(context, data),
    },
  ];
}

function normalizeIllustrationImage(context, metadata) {
  const { iri, type, name, version } = context.selectedDigitalObject;
  const datatable = metadata['datatable'];
  return datatable
    .filter((item) => item.split('.').pop() != 'csv')
    .map((item) => {
      const fileType = item.split('.').pop();
      const fileTypeName = fileType.toUpperCase();
      const illustrationName = name.replace(/-/g, ' ');
      return {
        id: `${iri}#${fileType}`,
        label: `${fileTypeName} image of ${illustrationName}`,
        type_of: ['ccf:FtuIllustrationFile'],
        file_url: `${context.cdnIri}${type}/${name}/${version}/${item}`,
        file_format: getMimeType(fileType),
      };
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
  const seen = new Set();
  return data.map((item) => {
    const nodeId = item['node_id'];
    if (!seen.has(nodeId)) {
      seen.add(nodeId);
      //const nodeLabel = item['node_label'];
      const nodeLabel = item['node_id'].replace(/_/g, ' ').toLowerCase();
      const nodeRepresentation = item['node_mapped_to'] || '';
      return {
        id: `${iri}#${nodeId}`,
        label: `An illustration node of ${nodeLabel}`,
        type_of: ['FtuIllustrationNode', nodeRepresentation],
        node_name: nodeId,
        part_of_illustration: `${iri}#primary`,
      };
    } else {
      return undefined;
    }
  }).filter((item) => item?.type_of[1]);
}
