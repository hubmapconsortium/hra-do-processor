import { Matrix4 } from '@math.gl/core';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { header } from '../utils/logging.js';
import { validateNormalized } from '../utils/validation.js';
import { processSceneNodes } from './ref-organ-utils/process-scene-nodes.js';
import { readMetadata, writeNormalized } from './utils.js';

export async function normalizeRefOrgan(context) {
  header(context, 'run-normalize');
  const rawData = await getRawData(context);
  const normalizedData = normalizeRawData(context, rawData);
  writeNormalized(context, normalizedData);
  validateNormalized(context);
}

async function getRawData(context) {
  const { path } = context.selectedDigitalObject;

  const metadata = readMetadata(context);
  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;

  let data;
  if (dataUrl.startsWith('http')) { 
    data = await processSpatialEntities(context, metadata, dataUrl);
  } else {
    // FIXME: Add deployment URL option to context
    const baseUrl = 'https://ccf-ontology.hubmapconsortium.org/objects/v1.2/';
    const gltfUrl = `${baseUrl}${dataUrl}`;

    // Load local GLB file, but ensure that the URL is placed in the output
    // for when it is deployed
    const cache = {
      [gltfUrl]: readFile(resolve(path, 'raw', dataUrl))
    }
    data = await processSpatialEntities(context, metadata, gltfUrl, cache);
  }

  return data;
}

async function processSpatialEntities(context, metadata, gltfFile, cache) {
  const scalar = new Matrix4(Matrix4.IDENTITY).scale([1000, 1000, 1000]);
  const nodes = await processSceneNodes(gltfFile, scalar, undefined, cache);

  const baseIri = metadata.config?.id || context.selectedDigitalObject.iri;
  const separator = baseIri?.indexOf('#') === -1 ? '#' : '_' ?? '#';

  const parentIri = metadata.config?.parentIri || `${baseIri}${separator}Parent`;

  return Object.values(nodes)
    .filter((n) => n['@type'] !== 'GLTFNode')
    .map((node) => {
      const id = `${baseIri}${separator}${encodeURIComponent(node['@id'])}`;
      const creationDate = metadata.creation_date;
      const T = { x: node.bbox.lowerBound.x, y: node.bbox.lowerBound.y, z: node.bbox.lowerBound.z };

      return {
        id,
        label: `${metadata.title} (${node['@id']})`,
        creator: metadata.creators.map(c => `${c.fullName} (${c.orcid})`).join(', '),
        creator_first_name: metadata.creators[0].firstName,
        creator_last_name: metadata.creators[0].lastName,
        creation_date: creationDate,
        x_dimension: node.size.x,
        y_dimension: node.size.y,
        z_dimension: node.size.z,
        dimension_unit: 'millimeter',

        object_reference: {
          'id': `${id}Obj`,
          file: gltfFile,
          file_format: 'model/gltf-binary',
          file_subpath: node['@id'],

          placement: {
            id: `${id}ObjPlacement`,
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

function normalizeRawData(context, data) {
  return data;
}
