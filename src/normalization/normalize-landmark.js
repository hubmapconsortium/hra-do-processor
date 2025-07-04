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

export function normalizeLandmarkMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalizeLandmarkData(context) {
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
  const name = obj.name;
  const separator = baseIri?.indexOf('#') === -1 ? '#' : '_' ?? '#';
  const organMetadata = getOrganMetadata(name);
  const organLabel = getOrganLabel(organMetadata);

  const extractionSets = {};
  const spatialEntities = Object.values(nodes)
    .filter((node) => excludeNodeType(node))
    .filter((node) => excludeNodeId(node))
    .filter((node) => validNodeId(node, crosswalk))
    .filter((node) => validExtractionSetId(node, crosswalk))
    .map((node) => {
      const nodeId = node['@id'];
      const id = `${baseIri}${separator}${encodeURIComponent(nodeId)}`;
      const T = { x: node.bbox.lowerBound.x, y: node.bbox.lowerBound.y, z: node.bbox.lowerBound.z };

      const landmarkName = getLandmarkName(nodeId, crosswalk);
      const landmarkRank = getLandmarkRank(nodeId, crosswalk);
      const landmarkLabel = `${landmarkName} landmark in ${organLabel.toLowerCase()}`.trim();

      const extractionSetIri = getExtractionSetIri(nodeId, crosswalk, baseIri);
      if (!extractionSets[extractionSetIri]) {
        extractionSets[extractionSetIri] = getExtractionSet(nodeId, crosswalk, baseIri, organLabel);
      }

      let parentIri = `${baseIri}${separator}parent`;
      if (organMetadata.sex) {
        parentIri = `https://purl.humanatlas.io/graph/hra-ccf-body#VH${organMetadata.sex}`;
      }

      return {
        id,
        label: `Spatial entity of ${landmarkLabel}`,
        pref_label: landmarkName,
        rui_rank: landmarkRank,
        type_of: ['ccf:SpatialEntity'],
        creators: metadata.creators.map((c) => {
          return {
            id: `https://orcid.org/${c.orcid}`,
            label: c.fullName,
            conforms_to: 'Person',
            type_of: ['schema:Person'],
            fullName: c.fullName,
            firstName: c.firstName,
            lastName: c.lastName,
            orcid: c.orcid,
          };
        }),
        x_dimension: node.size.x,
        y_dimension: node.size.y,
        z_dimension: node.size.z,
        dimension_unit: 'millimeter',
        object_reference: {
          id: `${id}_obj`,
          label: `3D object of ${landmarkLabel}`,
          type_of: ['ccf:SpatialObjectReference'],
          file_name: gltfFile.replace(/^.*[\\/]/, ''),
          file_url: gltfFile,
          file_format: 'model/gltf-binary',
          file_subpath: node['@id'],
          placement: {
            id: `${id}ObjPlacement`,
            label: `Local placement of ${landmarkLabel}`,
            type_of: ['ccf:SpatialPlacement'],
            source: `${id}_obj`,
            target: id,
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
            label: `Global placement of ${landmarkLabel}`,
            type_of: ['ccf:SpatialPlacement'],
            source: id,
            target: parentIri,
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
        extraction_set: extractionSetIri,
      };
    });

  return {
    landmarks: Object.values(extractionSets),
    spatial_entities: spatialEntities,
  };
}

function getOrganMetadata(doName) {
  const sex = doName.includes('female') ? 'Female' : doName.includes('male') ? 'Male' : undefined;
  const side = doName.includes('left') ? 'Left' : doName.includes('right') ? 'Right' : doName.includes('both') ? 'Both' : undefined;

  const exclude = new Set(['left', 'right', 'male', 'female', 'both', 'landmarks', 'extraction sites']);
  const name = doName
    .split('-')
    .filter((n) => !exclude.has(n))
    .join(' ');

  return { sex, side, name };
}

function getOrganLabel({ sex, side, name }) {
  const sideLabel = side && side === 'Both' ? 'Left and right' : side;
  return sideLabel ? `${sex} ${sideLabel.toLowerCase()} ${name.toLowerCase()}` : `${sex} ${name.toLowerCase()}`;
}

function getLandmarkName(nodeId, crosswalk) {
  const results = crosswalk.find((value) => value['node_name'] === nodeId);
  return results.label || '';
}

function getLandmarkRank(nodeId, crosswalk) {
  const rank = crosswalk.findIndex((value) => value['node_name'] === nodeId);
  return rank !== -1 ? rank : crosswalk.length;
}

function getExtractionSet(nodeId, crosswalk, baseIri, organLabel) {
  const results = crosswalk.find((value) => value['node_name'] === nodeId);
  const extractionSetIri = `${baseIri}#${encodeURIComponent(results.extraction_set_id.replace('#', ''))}`;
  return {
    id: extractionSetIri,
    type_of: ['ccf:ExtractionSet'],
    label: `Landmarks in ${organLabel.toLowerCase()}`,
    pref_label: results.extraction_set_label,
    extraction_set_for: results.extraction_set_for,
  };
}

function getExtractionSetIri(nodeId, crosswalk, baseIri) {
  const results = crosswalk.find((value) => value['node_name'] === nodeId);
  const extractionSetIri = `${baseIri}#${encodeURIComponent(results.extraction_set_id.replace('#', ''))}`;
  return extractionSetIri;
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
  return crosswalk.find((value) => value['node_name'] === node['@id']);
}

function validExtractionSetId(node, crosswalk) {
  const results = crosswalk.find((value) => value['node_name'] === node['@id']);
  const id = results.extraction_set_id;
  return id && id != '-';
}
