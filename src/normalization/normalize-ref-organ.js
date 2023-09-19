import { Matrix4 } from '@math.gl/core';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import Papa from 'papaparse';
import { header } from '../utils/logging.js';
import { processSceneNodes } from './ref-organ-utils/process-scene-nodes.js';
import {
  readMetadata,
  readLocalData,
  writeNormalizedMetadata,
  writeNormalizedData,
  getMetadataIri,
  getDataDistributions
} from './utils.js';

export function normalizeRefOrganMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

function normalizeMetadata(context, metadata) {
  const normalizedMetadata = {
    iri: getMetadataIri(context),
    ...metadata,
    distributions: getDataDistributions(context)
  };
  delete normalizedMetadata.type;
  delete normalizedMetadata.name;
  return normalizedMetadata;
}

export async function normalizeRefOrganData(context) {
  const rawData = await getRawData(context);
  const normalizedData = normalizeRawData(context, rawData);
  writeNormalizedData(context, normalizedData);
}

async function getRawData(context) {
  const { path } = context.selectedDigitalObject;

  const metadata = readMetadata(context);

  const crosswalk = readLocalData(context, "crosswalk.csv",
    (csvData) => Papa.parse(
        csvData.toString(), {
          header: true, 
          skipEmptyLines: true
        })).data;

  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;

  let data;
  if (dataUrl.startsWith('http')) { 
    data = await processSpatialEntities(context, metadata, dataUrl, undefined, crosswalk);
  } else {
    // FIXME: Add deployment URL option to context
    const baseUrl = 'https://ccf-ontology.hubmapconsortium.org/objects/v1.2/';
    const gltfUrl = `${baseUrl}${dataUrl}`;

    // Load local GLB file, but ensure that the URL is placed in the output
    // for when it is deployed
    const cache = {
      [gltfUrl]: readFile(resolve(path, 'raw', dataUrl))
    }
    data = await processSpatialEntities(context, metadata, gltfUrl, cache, crosswalk);
  }

  return data;
}

async function processSpatialEntities(context, metadata, gltfFile, cache, crosswalk) {
  const scalar = new Matrix4(Matrix4.IDENTITY).scale([1000, 1000, 1000]);
  const nodes = await processSceneNodes(gltfFile, scalar, undefined, cache);

  const baseIri = metadata.config?.id || context.selectedDigitalObject.iri;
  const separator = baseIri?.indexOf('#') === -1 ? '#' : '_' ?? '#';

  const parentIri = metadata.config?.parentIri || `${baseIri}${separator}Parent`;

  return Object.values(nodes)
    .filter((node) => node['@type'] !== 'GLTFNode')
    .filter((node) => node['@id'] !== 'scene-0')
    .map((node) => {
      const nodeId = node['@id'];
      const primaryNodeId = crosswalk[0]['node_name'];
      const id = (nodeId === primaryNodeId) ?
          `${baseIri}${separator}primary` :
          `${baseIri}${separator}${encodeURIComponent(nodeId)}`;
      const creationDate = metadata.creation_date;
      const T = { x: node.bbox.lowerBound.x, y: node.bbox.lowerBound.y, z: node.bbox.lowerBound.z };
      const typeOf = crosswalk.reduce((accumulator, value) => {
        if (value['node_name'] === node['@id']) {
          accumulator.push(value['OntologyID']);
        }
        return accumulator;
      }, ['SpatialEntity']);
      const organName = getOrganName(nodeId, crosswalk);
      const organOwnerSex = getOrganOwnerSex(nodeId);
      const organSide = getOrganSide(nodeId);
      const nodeLabel = getNodeLabel(nodeId);
      let organLabel = `${organOwnerSex} ${nodeLabel}`;
      if (organSide !== '') {
        organLabel = `${organOwnerSex} ${organSide} ${nodeLabel}`;
      }

      return {
        id,
        label: `Spatial entity of ${organLabel}`,
        pref_label: organName,
        class_type: 'SpatialEntity',
        typeOf: typeOf,
        creator: metadata.creators.map(c => {
            return { 
              id: `https://orcid.org/${c.orcid}`,
              label: c.fullName,
              class_type: 'Creator',
              typeOf: [ 'schema:Person' ],
              fullName: c.fullName,
              firstName: c.firstName,
              lastName: c.lastName,
              orcid: c.orcid
            }
          }),
        create_date: creationDate,
        x_dimension: node.size.x,
        y_dimension: node.size.y,
        z_dimension: node.size.z,
        dimension_unit: 'millimeter',

        object_reference: {
          id: `${id}Obj`,
          label: `The 3D object of ${organLabel}`,
          class_type: 'SpatialObjectReference',
          typeOf: [ 'SpatialObjectReference' ],
          file: gltfFile,
          file_format: 'model/gltf-binary',
          file_subpath: node['@id'],

          placement: {
            id: `${id}ObjPlacement`,
            label: `The local placement of ${organLabel}`,
            class_type: 'SpatialPlacement',
            typeOf: [ 'SpatialPlacement' ],
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

        placements: [{
          id: `${id}GlobalPlacement`,
          label: `The global placement of ${organLabel}`,
          class_type: 'SpatialPlacement',
          typeOf: [ 'SpatialPlacement' ],
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
        }]
      };
    });
}

function getOrganName(nodeId, crosswalk) {
  const organ = crosswalk.filter((value) => value["node_name"] === nodeId);
  return organ[0]["label"];
}

function getOrganOwnerSex(nodeId) {
  const sexAbbreviation = nodeId.match(/^VH_(F|M)_([a-z_]+)_?([L|R]?)_?(.?)/)[1];
  return (sexAbbreviation === "F") ? "female" : "male";
}

function getOrganSide(nodeId) {
  const sideAbbreviation = nodeId.match(/^VH_(F|M)_([a-z_]+)_?([L|R]?)_?(.?)/)[3];
  if (sideAbbreviation === "L") {
    return "left";
  } else if (sideAbbreviation === "R") {
    return "right";
  } else {
    return "";
  }
}

function getNodeLabel(nodeId) {
  const matching = nodeId.match(/^VH_(F|M)_([a-z_]+)_?([L|R]?)_?(.?)/);
  const organLabel = matching[2].replaceAll("_", " ").trim();
  const partOrder = matching[4];
  if (partOrder !== "") {
    return `${organLabel} ${partOrder}`
  } else {
    return organLabel;
  }
}

function normalizeRawData(context, data) {
  return data;
}
