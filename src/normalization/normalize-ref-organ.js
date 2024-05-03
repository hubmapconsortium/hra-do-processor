import { Matrix4 } from '@math.gl/core';
import { readFile } from 'fs/promises';
import Papa from 'papaparse';
import { resolve } from 'path';
import { processSceneNodes } from './ref-organ-utils/process-scene-nodes.js';
import {
  normalizeMetadata,
  readLocalData,
  readMetadata,
  writeNormalizedData,
  writeNormalizedMetadata,
} from './utils.js';

export function normalizeRefOrganMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalizeRefOrganData(context) {
  const rawData = await getRawData(context);
  const normalizedData = normalizeRawData(context, rawData);
  writeNormalizedData(context, normalizedData);
}

async function getRawData(context) {
  const { path, doString } = context.selectedDigitalObject;

  const metadata = readMetadata(context);

  const crosswalk = readLocalData(context, 'crosswalk.csv', (csvData) =>
    Papa.parse(csvData.toString(), {
      header: true,
      skipEmptyLines: true,
    })
  ).data;

  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;

  let data;
  if (dataUrl.startsWith('http')) {
    data = await processSpatialEntities(context, metadata, dataUrl, undefined, crosswalk);
  } else {
    const gltfUrl = `${context.cdnIri}${doString}/assets/${dataUrl}`;

    // Load local GLB file, but ensure that the URL is placed in the output
    // for when it is deployed
    const cache = {
      [gltfUrl]: readFile(resolve(path, 'raw', dataUrl)),
    };
    data = await processSpatialEntities(context, metadata, gltfUrl, cache, crosswalk);
  }

  return data;
}

async function processSpatialEntities(context, metadata, gltfFile, cache, crosswalk) {
  const scalar = new Matrix4(Matrix4.IDENTITY).scale([1000, 1000, 1000]);
  const nodes = await processSceneNodes(gltfFile, scalar, undefined, cache);

  const obj = context.selectedDigitalObject;
  const baseIri = obj.iri;
  const separator = baseIri?.indexOf('#') === -1 ? '#' : '_' ?? '#';
  const primaryId = `${baseIri}${separator}primary`;
  const refOrganName = getRefOrganName(obj.name);

  return Object.values(nodes)
    .filter((node) => excludeNodeType(node))
    .filter((node) => excludeNodeId(node))
    .filter((node) => validNodeId(node, crosswalk))
    .map((node) => {
      const nodeId = node['@id'];
      const primaryNodeId = crosswalk[0]['node_name'];
      const id =
        nodeId === primaryNodeId
          ? primaryId
          : `${baseIri}${separator}${encodeURIComponent(nodeId)}`;
      const creationDate = metadata.creation_date;
      const T = { x: node.bbox.lowerBound.x, y: node.bbox.lowerBound.y, z: node.bbox.lowerBound.z };
      const typeOf = [
        ...crosswalk.reduce((accumulator, value) => {
          if (value['node_name'] === node['@id']) {
            accumulator.add(value['OntologyID'].trim());
          }
          return accumulator;
        }, new Set()),
      ].concat(['SpatialEntity']);

      const organName = getOrganName(nodeId, crosswalk);
      const organMetadata = getOrganMetadata(obj.name);
      const nodeLabel = getNodeLabel(nodeId);
      const nodeRank = getNodeRank(nodeId, crosswalk);
      const organLabel = getOrganLabel(organMetadata, nodeLabel);

      let parentIri = `${baseIri}${separator}parent`;
      if (organMetadata.sex === 'Female') {
        parentIri = `https://purl.humanatlas.io/graph/hra-ccf-body#VHFemale`;
      } else if (organMetadata.sex === 'Male') {
        parentIri = `https://purl.humanatlas.io/graph/hra-ccf-body#VHMale`;
      }

      return {
        id,
        label: `Spatial entity of ${organLabel}`,
        pref_label: nodeId === primaryNodeId ? refOrganName : organName,
        rui_rank: nodeRank,
        class_type: 'SpatialEntity',
        typeOf: typeOf,
        representation_of: typeOf[0],
        organ_owner_sex: organMetadata.sex || undefined,
        organ_side: organMetadata.side || undefined,
        reference_organ: primaryId,
        creator: metadata.creators.map((c) => {
          return {
            id: `https://orcid.org/${c.orcid}`,
            label: c.fullName,
            class_type: 'Creator',
            typeOf: ['schema:Person'],
            fullName: c.fullName,
            firstName: c.firstName,
            lastName: c.lastName,
            orcid: c.orcid,
          };
        }),
        create_date: creationDate,
        x_dimension: node.size.x,
        y_dimension: node.size.y,
        z_dimension: node.size.z,
        dimension_unit: 'millimeter',

        object_reference: {
          id: `${id}_obj`,
          label: `3D object of ${organLabel}`,
          class_type: 'SpatialObjectReference',
          typeOf: ['SpatialObjectReference'],
          file_name: gltfFile.replace(/^.*[\\/]/, ''),
          file_url: gltfFile,
          file_format: 'model/gltf-binary',
          file_subpath: node['@id'],

          placement: {
            id: `${id}_obj_placement`,
            label: `Local placement of ${organLabel}`,
            class_type: 'SpatialPlacement',
            typeOf: ['SpatialPlacement'],
            source: `${id}_obj`,
            target: id,
            placement_date: creationDate,
            x_scaling: 1,
            y_scaling: 1,
            z_scaling: 1,
            scaling_unit: 'ratio',
            x_rotation: -90,
            y_rotation: 0,
            z_rotation: 0,
            rotation_unit: 'degree',
            x_translation: -T.x,
            y_translation: -T.y,
            z_translation: -T.z,
            translation_unit: 'millimeter',
          },
        },

        placements: [
          {
            id: `${id}_global_placement`,
            label: `Global placement of ${organLabel}`,
            class_type: 'SpatialPlacement',
            typeOf: ['SpatialPlacement'],
            source: id,
            target: parentIri,
            placement_date: creationDate,
            x_scaling: 1,
            y_scaling: 1,
            z_scaling: 1,
            scaling_unit: 'ratio',
            x_rotation: 0,
            y_rotation: 0,
            z_rotation: 0,
            rotation_unit: 'degree',
            x_translation: T.x,
            y_translation: T.y,
            z_translation: T.z,
            translation_unit: 'millimeter',
          },
        ],
      };
    });
}

function getOrganMetadata(doName) {
  const sex = doName.includes('female') ? 'Female' : doName.includes('male') ? 'Male' : undefined;
  const side = doName.includes('left') ? 'Left' : doName.includes('right') ? 'Right' : undefined;

  const exclude = new Set(['left', 'right', 'male', 'female']);
  const name = doName.split('-').filter(n => !exclude.has(n)).join(' ');
  return { name, sex, side };
}

function getRefOrganName(doName) {
  const { name, side } = getOrganMetadata(doName);
  return [side, name].filter(s => !!s).join(' ');
}

function getOrganName(nodeId, crosswalk) {
  const organ = crosswalk.filter((value) => value['node_name'] === nodeId);
  return organ[0]['label'];
}

function getOrganLabel({sex, side}, nodeLabel) {
  const organOwnerSex = sex.toLowerCase();
  const organSide = side?.toLowerCase();
  let organLabel = `${organOwnerSex} ${nodeLabel}`.trim();
  if (organSide && !organLabel.includes(organSide)) {
    organLabel = `${organOwnerSex} ${organSide} ${nodeLabel}`.trim();
  }
  return organLabel;
}

function getNodeRank(nodeId, crosswalk) {
  const rank = crosswalk.findIndex((value) => value['node_name'] === nodeId);
  return rank !== -1 ? rank : crosswalk.length;
}

function getNodeLabel(nodeId) {
  let matching = nodeId.match(/^VH_(F|M)_([a-z_]+)_?([L|R]?)_?(.?)/);
  let organLabelIndex = 2;
  let partOrderIndex = 4;
  if (matching === null) {
    matching = nodeId.match(/^VH_(F|M)_([L|R])_([a-z_]+)_?(.?)/);
    organLabelIndex = 3;
    partOrderIndex = 4;
  }
  if (matching === null) {
    matching = nodeId.match(/^Yao_([a-z_]+)_?(.?)/);
    organLabelIndex = 1;
    partOrderIndex = 2;
  }
  if (matching === null) {
    matching = nodeId.match(/^Allen_([a-z_]+)_?(.?)/);
    organLabelIndex = 1;
    partOrderIndex = 2;
  }
  if (matching !== null) {
    const organLabel = matching[organLabelIndex].replaceAll('_', ' ').trim();
    const partOrder = matching[partOrderIndex];
    if (partOrder !== '') {
      return `${organLabel} ${partOrder}`;
    } else {
      return organLabel;
    }
  } else {
    return '';
  }
}

function normalizeRawData(context, data) {
  return data;
}

function excludeNodeType(node) {
  return node['@type'] !== 'GLTFNode';
}

function excludeNodeId(node) {
  return node['@id'] !== 'scene-0';
}

function validNodeId(node, crosswalk) {
  return crosswalk.find((value) => value['node_name'] === node['@id'] && value['OntologyID'] && value['label']);
}
