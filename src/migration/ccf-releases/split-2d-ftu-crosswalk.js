import { readFileSync, writeFileSync } from 'fs';
import { load } from 'js-yaml';
import Papa from 'papaparse';
import { resolve } from 'path';

export function split2dFtuCrosswalk(context, crosswalkDo, doString) {
  const srcDir = resolve(context.processorHome, 'src/migration/ccf-releases');

  const doName = doString.split('/')[1];
  const LOOKUP = resolve(srcDir, '2d-ftu-lookup.csv');
  const FIRST_COL = 'anatomical_structure_of';

  const ftuLookupRows = Papa.parse(readFileSync(LOOKUP).toString(), {
    header: true,
    skipEmptyLines: true,
  }).data;
  const ftuInfo = ftuLookupRows.find((row) => row.id === doName);
  if (!ftuInfo) {
    console.log(`can't find ${doName} in ${crosswalkDo}`);
    process.exit();
  }
  const oldFtuIds = new Set(ftuLookupRows.filter((row) => row.id === doName).map((row) => row.old_id));

  // Load the full crosswalk
  const crosswalkMetaFile = resolve(context.doHome, crosswalkDo, 'raw/metadata.yaml');
  const crosswalkMetadata = load(readFileSync(crosswalkMetaFile).toString());
  const crosswalkFile = crosswalkMetadata.datatable.find((s) => s.includes('.csv'));
  const crosswalkPath = resolve(context.doHome, crosswalkDo, 'raw', crosswalkFile);
  const crosswalkLines = readFileSync(crosswalkPath).toString().split('\n');
  const headerRow = crosswalkLines.findIndex((line) => line.includes(FIRST_COL));
  const crosswalkText = crosswalkLines.slice(headerRow).join('\n');
  const crosswalkRows = Papa.parse(crosswalkText, { header: true }).data.filter(
    (row) => row['OntologyID'] !== '-' && row['OntologyID'] !== ''
  );

  const ftuCrosswalkRows = crosswalkRows
    .filter((row) => {
      const id = row.anatomical_structure_of;
      return oldFtuIds.has(id) || (id === '#FTUAlveolus' && oldFtuIds.has('#FTUAlveoli'));
    })
    .map((row) => ({
      node_id: row.node_name,
      node_label: row.label,
      node_mapped_to: row.OntologyID,
      tissue_label: ftuInfo.label,
      tissue_mapped_to: ftuInfo.representation_of,
      organ_label: row.organ_label || ftuInfo.organ_label,
      organ_mapped_to: row.organ_id || ftuInfo.organ_id,
    }));

  // Remove duplicates
  const seen = new Set();
  const ftuCrosswalk = [];
  for (const row of ftuCrosswalkRows) {
    if (!seen.has(row.node_id)) {
      seen.add(row.node_id);
      ftuCrosswalk.push(row);
    }
  }

  const ftuCrosswalkFile = resolve(context.doHome, doString, 'raw/crosswalk.csv');
  writeFileSync(ftuCrosswalkFile, Papa.unparse(ftuCrosswalk, { header: true }));
  if (ftuCrosswalk.length === 0) {
    console.log(`Warning (may not be an error): no rows found in ${crosswalkDo} for ${doString}`);
  }
}
