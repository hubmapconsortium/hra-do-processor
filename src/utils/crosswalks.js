import { readFileSync } from 'fs';
import Papa from 'papaparse';
import { resolve } from 'path';
import { readMetadata } from '../normalization/utils.js';
import { getDigitalObjectInformation } from '../utils/digital-object.js';

export function getCrosswalkRows(context, crosswalk, FIRST_COL = 'anatomical_structure_of') {
  const crosswalkDo = getDigitalObjectInformation(resolve(context.doHome, crosswalk), context.purlIri);
  const crosswalkFile = readMetadata({ ...context, selectedDigitalObject: crosswalkDo })['datatable'].find((f) =>
    f.endsWith('.csv')
  );
  const crosswalkPath = resolve(crosswalkDo.path, 'raw', crosswalkFile);
  const crosswalkLines = readFileSync(crosswalkPath).toString().split('\n');
  const headerRow = crosswalkLines.findIndex((line) => line.startsWith(FIRST_COL));
  const crosswalkText = crosswalkLines.slice(headerRow).join('\n');
  const crosswalkRows = Papa.parse(crosswalkText, { header: true }).data.filter((row) => row['OntologyID'] !== '-');
  return crosswalkRows;
}
