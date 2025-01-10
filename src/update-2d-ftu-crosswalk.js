import { readFileSync, writeFileSync } from 'fs';
import Papa from 'papaparse';
import { resolve } from 'path';
import { readMetadata } from './normalization/utils.js';
import { getCrosswalkRows } from './utils/crosswalks.js';

const CROSSWALK_COLS = [
  'node_id',
  'node_group',
  'node_label',
  'node_mapped_to',
  'tissue_label',
  'tissue_mapped_to',
  'organ_label',
  'organ_mapped_to',
];

export function update2dFtuCrosswalk(context) {
  const obj = context.selectedDigitalObject;
  const objCrosswalkFile = resolve(obj.path, 'raw/crosswalk.csv');
  const svgFile = readMetadata(context)['datatable'].find((f) => f.endsWith('.svg'));
  const svgPath = resolve(obj.path, 'raw', svgFile);
  const svgIds = getSvgIds(svgPath);
  const crosswalkRows = getCrosswalkRows(context, context.crosswalk, 'organ_label');
  const ftuInfo = getFtuInfo(context);

  const subset = subsetCrosswalk(crosswalkRows, svgFile, svgIds, ftuInfo);
  const crosswalkString = Papa.unparse(subset, { header: true, columns: CROSSWALK_COLS });
  writeFileSync(objCrosswalkFile, crosswalkString);
}

function subsetCrosswalk(crosswalkRows, svgFile, svgIds, ftuInfo) {
  const rows = crosswalkRows
    .filter((row) => svgFile.startsWith(row['svg file of single 2DFTU']))
    .map((row) => ({
      node_id: row.node_name,
      node_group: row.node_group,
      node_label: row.label,
      node_mapped_to: row.OntologyID,
      tissue_label: row.tissue_label || ftuInfo?.label,
      tissue_mapped_to: row.tissue_id || ftuInfo?.representation_of,
      organ_label: row.organ_label || ftuInfo?.organ_label,
      organ_mapped_to: row.organ_id || ftuInfo?.organ_id,
    }));
  const matches = [];
  for (const svgId of svgIds) {
    const row = rows.find((n) => n.node_id.toLowerCase() === svgId);
    if (row) {
      matches.push(row);
    }
  }
  const unmatchedCells = rows.filter((row) => !svgIds.has(row.node_id.toLowerCase())).map((n) => n.node_id);
  if (unmatchedCells.length > 0) {
    console.log(`WARNING: mapped cells not present in "${svgFile}": ${unmatchedCells.join(', ')}\n`);
  }
  return rows;
}

function getSvgIds(svgPath) {
  const data = readFileSync(svgPath, 'utf8');

  const idRegex = /id="([^"]+)"/g;
  let match;
  const ids = new Set();

  while ((match = idRegex.exec(data)) !== null) {
    ids.add(match[1].replace(/\_x5F\_/g, '_').toLowerCase());
  }
  return ids;
}

function getFtuInfo(context) {
  const obj = context.selectedDigitalObject;
  const srcDir = resolve(context.processorHome, 'src/migration/ccf-releases');
  const LOOKUP = resolve(srcDir, '2d-ftu-lookup.csv');

  const ftuLookupRows = Papa.parse(readFileSync(LOOKUP).toString(), {
    header: true,
    skipEmptyLines: true,
  }).data;

  const ftuInfo = ftuLookupRows.find((row) => row.id === obj.name);
  if (!ftuInfo) {
    console.log(`WARNING: can't find ${obj.name} tissue info in ${LOOKUP}`);
  }
  return ftuInfo;
}
