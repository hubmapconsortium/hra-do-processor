import { writeFileSync } from 'fs';
import Papa from 'papaparse';
import { basename, resolve } from 'path';
import sh from 'shelljs';
import { getDigitalObjectInformation } from '../../utils/digital-object.js';
import { getSceneNodes } from './get-scene-nodes.js';
import { getLandmarkMetadata } from './renaming.js';
import { writeMetadata } from './metadata.js';

const CROSSWALK_HEADER = ['extraction_set_for', 'extraction_set_id', 'extraction_set_label', 'node_name', 'label'];
const SOURCE_DATA_URL = 'https://raw.githubusercontent.com/hubmapconsortium/hubmap-ontology/master/source_data';

export async function migrateLandmarks(context) {
  const extractionSiteUrls = (await fetchCsv(`${SOURCE_DATA_URL}/extraction-site-config.csv`)).map((row) => row.object);
  const fullCrosswalk = await fetchCsv(`${SOURCE_DATA_URL}/asct-b-3d-models-landmarks.csv`, 10);

  for (const url of extractionSiteUrls) {
    const nodes = await getSceneNodes(url);
    const filteredCrosswalk = fullCrosswalk.filter((row) => nodes.has(row.node_name));
    const { refOrgans, name, version, title } = getLandmarkMetadata(url);
    const refOrganIris = refOrgans.map((n) => `${context.purlIri}ref-organ/${n}#primary`);
    const crosswalk = deriveCrosswalk(filteredCrosswalk, refOrganIris);

    const doPath = resolve(context.doHome, 'landmark', name, version);
    context.selectedDigitalObject = getDigitalObjectInformation(doPath, context.purlIri);

    sh.mkdir('-p', resolve(doPath, 'raw'));
    writeCsv(resolve(doPath, 'raw/crosswalk.csv'), crosswalk, CROSSWALK_HEADER);

    const glbPath = resolve(doPath, 'raw', url.split('/').slice(-1)[0]);
    sh.exec(`curl -s -L ${url} -o ${glbPath}`);

    writeMetadata(context, { title, datatable: [
      basename(glbPath), 'crosswalk.csv'
    ]});
  }
}

function deriveCrosswalk(filteredCrosswalk, refOrgans) {
  const crosswalk = [];
  for (const row of filteredCrosswalk) {
    if (row.extraction_set_for === '-') {
      crosswalk.push(row);
    } else {
      for (const refOrgan of refOrgans) {
        crosswalk.push({ ...row, extraction_set_for: refOrgan });
      }
    }
  }
  return crosswalk;
}

async function fetchCsv(csvUrl, skipLines = undefined) {
  let csvString = await fetch(csvUrl).then((r) => r.text());
  if (skipLines && skipLines > 0) {
    csvString = csvString.split('\n').slice(skipLines).join('\n');
  }
  const result = Papa.parse(csvString, { header: true, skipEmptyLines: true });
  return result.data;
}

function writeCsv(filePath, rows, columns = undefined) {
  const csvString = Papa.unparse(rows, { header: true, columns });
  writeFileSync(filePath, csvString);
}
