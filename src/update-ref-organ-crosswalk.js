import { writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import Papa from 'papaparse';
import { resolve } from 'path';
import { loadGLTF } from './normalization/ref-organ-utils/load-gltf.js';
import { readMetadata } from './normalization/utils.js';
import { getCrosswalkRows } from './utils/crosswalks.js';

export async function updateRefOrganCrosswalk(context) {
  const obj = context.selectedDigitalObject;
  const objCrosswalkFile = resolve(obj.path, 'raw/crosswalk.csv');
  const refOrgan = await readDigitalObjectGLB(context);
  const crosswalkRows = getCrosswalkRows(context, context.crosswalk);

  const subset = subsetCrosswalk(crosswalkRows, refOrgan);
  const crosswalkString = Papa.unparse(subset, { header: true, columns: ['node_name', 'OntologyID', 'label'] });
  writeFileSync(objCrosswalkFile, crosswalkString);
}

function subsetCrosswalk(crosswalkRows, gltf) {
  const results = [];
  for (const node of gltf.nodes) {
    const row = crosswalkRows.find((n) => n.node_name === node.name);
    if (row) {
      results.push({
        node_name: node.name,
        OntologyID: row.OntologyID,
        label: row.label,
      });
    } else if (node.extras?.ontologyid && node.extras.ontologyid !== '-') {
      results.push({
        node_name: node.name,
        OntologyID: node.extras.ontologyid,
        label: node.extras.label,
      });
    }
  }
  return results;
}

async function readDigitalObjectGLB(context) {
  const obj = context.selectedDigitalObject;
  const glbFile = readMetadata(context)['datatable'].find((f) => f.endsWith('.glb'));
  const gltfUrl = `${context.cdnIri}${obj.doString}/assets/${glbFile}`;

  // Load local GLB file, but ensure that the URL is placed in the output
  // for when it is deployed
  const cache = {
    [gltfUrl]: readFile(resolve(obj.path, 'raw', glbFile)),
  };
  return await loadGLTF({ scenegraph: gltfUrl }, cache);
}
