import { readFileSync, writeFileSync } from 'fs';
import { load } from 'js-yaml';
import Papa from 'papaparse';
import { resolve } from 'path';

export function splitRefOrganCrosswalk(context, crosswalkDo, refOrganDo) {
  const srcDir = resolve(context.processorHome, 'src/migration/ccf-releases');

  const LOOKUP = resolve(srcDir, 'ref-organ-lookup.csv');
  const FIRST_COL = 'anatomical_structure_of';

  // Get reference organ GLB filename
  const refOrganMetadataFile = resolve(context.doHome, refOrganDo, 'raw/metadata.yaml');
  const refOrganMetadata = load(readFileSync(refOrganMetadataFile).toString());
  const glbFile = refOrganMetadata.datatable.find((s) => s.includes('.glb')).replace(/\.glb.*/, '');

  // Find the old id for a reference organ
  const refOrganIdLookupRows = Papa.parse(readFileSync(LOOKUP).toString(), {
    header: true,
    skipEmptyLines: true,
  }).data;
  const refOrganIdInfo = refOrganIdLookupRows.find(
    (row) => glbFile.includes(row.glbFile) || row.glbFile.includes(glbFile)
  );
  if (!refOrganIdInfo && !refOrganDo.startsWith('ref-organ/united-')) {
    console.log(`can't find lookup from ${crosswalkDo} (${glbFile}) for ${refOrganDo}`);
    process.exit();
  }
  const refOrgan = refOrganIdInfo?.['oldId'];

  // Load the full crosswalk
  const crosswalkMetaFile = resolve(context.doHome, crosswalkDo, 'raw/metadata.yaml');
  const crosswalkMetadata = load(readFileSync(crosswalkMetaFile).toString());
  const crosswalkFile = crosswalkMetadata.datatable.find((s) => s.includes('.csv'));
  const crosswalkPath = resolve(context.doHome, crosswalkDo, 'raw', crosswalkFile);
  const crosswalkLines = readFileSync(crosswalkPath).toString().split('\n');
  const headerRow = crosswalkLines.findIndex((line) => line.startsWith(FIRST_COL));
  const crosswalkText = crosswalkLines.slice(headerRow).join('\n');
  const crosswalkRows = Papa.parse(crosswalkText, { header: true }).data.filter((row) => row['OntologyID'] !== '-');

  // Filter the full crosswalk to just the info we need for this reference organ
  const refOrganCrosswalk = crosswalkRows
    .filter((row) => {
      const id = row['anatomical_structure_of'];

      return (
        id.startsWith(refOrgan) ||
        // united uses all nodes as crosswalk
        refOrganDo.startsWith('ref-organ/united-') ||
        // Some exceptions as IDs have changed over the years
        (id === '#VHFColon' && refOrgan === '#VHFLargeIntestine') ||
        (id === '#VHFLymphNode' && glbFile === 'NIH_F_Lymph_Node') ||
        (id === '#VHMLymphNode' && glbFile === 'NIH_M_Lymph_Node')
      );
    })
    .map((row) => ({
      ...row,
      // Special case for a malformed CURIE
      OntologyID: row.OntologyID?.toLowerCase() === 'ma:fma46564' ? 'FMA:46564' : row.OntologyID,
    }));

  const refOrganCrosswalkFile = resolve(context.doHome, refOrganDo, 'raw/crosswalk.csv');
  writeFileSync(
    refOrganCrosswalkFile,
    Papa.unparse(refOrganCrosswalk, { header: true, columns: ['node_name', 'OntologyID', 'label'] })
  );
  if (refOrganCrosswalk.length === 0) {
    console.log(`no rows found in ${crosswalkDo} for ${refOrganDo}`);
  }
}
