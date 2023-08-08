import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { info, more, warning } from '../utils/logging.js';
import {
  getPatchesForAnatomicalStructure,
  getPatchesForBiomarker,
  getPatchesForCellType,
  isDoiValid,
  isIdValid,
  normalizeDoi
} from './patches.js';
import { readMetadata, writeNormalizedMetadata, writeNormalizedData } from './utils.js';

const ASCTB_API = 'https://mmpyikxkcp.us-east-2.awsapprunner.com/';

export function normalizeAsctbMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(rawMetadata);
  writeNormalizedMetadata(context, rawMetadata);
}

function normalizeMetadata(metadata) {
  delete metadata.type;
  delete metadata.name;
  return metadata;
}

export async function normalizeAsctbData(context) {
  const rawData = await getRawData(context);
  const normalizedData = normalizeData(context, rawData);
  writeNormalizedData(context, normalizedData);
}

async function getRawData(context) {
  const { path } = context.selectedDigitalObject;

  const metadata = readMetadata(context);
  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;
  let requestUrl = ASCTB_API + 'v2/csv';
  let data;
  if (dataUrl.startsWith('http')) {
    requestUrl +=
      '?' +
      new URLSearchParams({
        csvUrl: dataUrl,
        cached: true,
      });
    data = await fetch(requestUrl).then((r) => r.json());
  } else {
    const formData = new FormData();
    const dataPath = resolve(path, 'raw', dataUrl);
    formData.append(
      'csvFile',
      new Blob([readFileSync(dataPath).toString()], { type: 'text/csv', path: dataPath }),
      dataUrl
    );
    data = await fetch(requestUrl, { method: 'POST', body: formData }).then((r) => r.json());
  }
  info(`Reading data: ${dataUrl}`);

  // If warnings are found in the response, save for reference.
  const warningsFile = resolve(path, 'normalized/warnings.yaml');
  sh.rm('-f', warningsFile); // Clear previous warnings file
  if (!context.skipValidation && data.warnings?.length > 0) {
    writeFileSync(warningsFile, dump(data.warnings));
    warning('Warnings were reported by the ASCTB-API. This may indicate further errors that need resolved.')
    more(`Please review the warnings at ${warningsFile}`);
  }

  return data.data;
}

function normalizeData(context, data) {
  const { excludeBadValues } = context;
  if (excludeBadValues) {
    warning(`Option '--exclude-bad-values' is used to exclude invalid values. The resulting data may be lessen than the raw data.`)
  }
  return {
    anatomical_structures: normalizeAsData(context, data),
    cell_types: normalizeCtData(context, data),
    biomarkers: normalizeBmData(context, data),
  };
}

function normalizeAsData(context, data) {
  return data.reduce((collector, row) => {
    row.anatomical_structures
       .filter(({id, name}) => checkNotEmpty(id) || checkNotEmpty(name))
       .map(({id, name}) => {
          return {
            id: generateIdWhenEmpty(id, name),
            name: name,
            is_provisional: !checkNotEmpty(id),
          };
        })
       .filter(({id}) => passIdFilterCriteria(context, id))
       .reduce(normalizeAs, collector);
    return collector;
  }, getPatchesForAnatomicalStructure(context));
}

function normalizeAs(collector, {id: as_id, name: as_name, is_provisional}, index, array) {
  const foundEntity = collector.find(
    (entityInCollector) => entityInCollector.id === as_id
  );
  if (foundEntity) {
    const oldPartOf = foundEntity.ccf_part_of;
    const newPartOf = [
      ...oldPartOf,
      getPartOfEntity(array, index),
    ];
    foundEntity.ccf_part_of = removeDuplicates(newPartOf);
  } else {
    collector.push({
      id: as_id,
      class_type: "AnatomicalStructure",
      ccf_pref_label: as_name,
      ccf_asctb_type: "AS",
      ccf_is_provisional: is_provisional,
      ccf_part_of: [ getPartOfEntity(array, index) ], 
    });
  }
  return collector;
}

function getPartOfEntity(array, index) {
  return (index === 0) 
    ? "UBERON:0013702" // body proper
    : array[index-1].id // previous array item
}

function normalizeCtData(context, data) {
  return data.reduce((collector, row) => {
    row.cell_types
       .filter(({id, name}) => checkNotEmpty(id) || checkNotEmpty(name))
       .map(({id, name}) => {
          return {
            id: generateIdWhenEmpty(id, name),
            name: name,
            is_provisional: !checkNotEmpty(id),
          };
        })
       .filter(({id}) => passIdFilterCriteria(context, id))
       .reduce(normalizeCt, collector);

    // Add ccf_located_in relationship that is between AS and CT
    const last_as = row.anatomical_structures
                       .filter(({id, name}) => checkNotEmpty(id) || checkNotEmpty(name))
                       .map(({id, name}) => generateIdWhenEmpty(id, name))
                       .filter((id) => passIdFilterCriteria(context, id))
                       .pop();
    const last_ct = row.cell_types
                       .filter(({id, name}) => checkNotEmpty(id) || checkNotEmpty(name))
                       .map(({id, name}) => generateIdWhenEmpty(id, name))
                       .filter((id) => passIdFilterCriteria(context, id))
                       .pop();
    if (last_ct) {
      addLocatedIn(collector, last_ct, last_as);
    }
    // Add has_biomarker relationship between CT and BM
    const biomarkers = row.biomarkers
                          .filter(({id, name}) => checkNotEmpty(id) || checkNotEmpty(name))
                          .map(({id, name}) => generateIdWhenEmpty(id, name))
                          .filter((id) => passIdFilterCriteria(context, id));
    const references = row.references
                          .filter(({doi}) => checkNotEmpty(doi))
                          .map(({doi}) => normalizeDoi(doi))
                          .filter((doi) => passDoiFilterCriteria(context, doi));
    if (last_ct) {
      addCharacterizingBiomarkers(collector, last_ct, biomarkers, references);
    }
    return collector;
  }, getPatchesForCellType())
}

function normalizeCt(collector, {id: ct_id, name: ct_name, is_provisional}, index, array) {
  const foundEntity = collector.find(
    (entityInCollector) => entityInCollector.id === ct_id
  );
  if (foundEntity) {
    const oldCtIsa = foundEntity.ccf_ct_isa;
    const newCtIsa = [
      ...oldCtIsa,
      getCtIsaEntity(array, index),
    ];
    foundEntity.ccf_ct_isa = removeDuplicates(newCtIsa);
  } 
  else {
    collector.push({
      id: ct_id,
      class_type: "CellType",
      ccf_pref_label: ct_name,
      ccf_asctb_type: "CT",
      ccf_is_provisional: is_provisional,
      ccf_ct_isa: [ getCtIsaEntity(array, index) ], 
      ccf_located_in: [],
      ccf_has_biomarker_set: [],
    });
  }
  return collector;
}

function getCtIsaEntity(array, index) {
  return (index === 0) 
    ? "CL:0000000" // cell type
    : array[index-1].id; // previous array item
}

function addLocatedIn(collector, cellType, anatomicalStructure) {
  const foundEntity = collector.find(
    (entityInCollector) => entityInCollector.id === cellType
  );
  if (foundEntity) {
    const oldLocatedIn = foundEntity.ccf_located_in;
    const newLocatedIn = [
      ...oldLocatedIn,
      anatomicalStructure
    ];
    foundEntity.ccf_located_in = removeDuplicates(newLocatedIn);
  }
}

function addCharacterizingBiomarkers(collector, cellType, biomarkers, references) {
  const foundEntity = collector.find(
    (entityInCollector) => entityInCollector.id === cellType
  );
  if (foundEntity) {
    const oldHasBiomarker = foundEntity.ccf_has_biomarker_set;
    const newHasBiomarker = [
      ...oldHasBiomarker,
      { 
        members: removeDuplicates(biomarkers),
        references: removeDuplicates(references),
      }
    ];
    foundEntity.ccf_has_biomarker_set = removeDuplicates(newHasBiomarker);
  }
}

function normalizeBmData(context, data) {
  return data.reduce((collector, row) => {
    row.biomarkers
       .filter(({id, name}) => checkNotEmpty(id) || checkNotEmpty(name))
       .map(({id, name, b_type}) => {
          return {
            id: generateIdWhenEmpty(id, name),
            name: name,
            b_type: b_type,
            is_provisional: !checkNotEmpty(id),
          };
        })
       .filter(({id}) => passIdFilterCriteria(context, id))
       .reduce(normalizeBm, collector);
    return collector;
  }, getPatchesForBiomarker())
}

function normalizeBm(collector, {id: bm_id, name: bm_name, b_type, is_provisional}, index, array) {
  const foundEntity = collector.find(
    (entityInCollector) => entityInCollector.id === bm_id
  );
  if (!foundEntity) {
    collector.push({
      id: bm_id,
      class_type: "Biomarker",
      ccf_pref_label: bm_name,
      ccf_asctb_type: "BM",
      ccf_biomarker_type: b_type,
      ccf_is_provisional: is_provisional,
    });
  }
  return collector;
}

function generateIdWhenEmpty(id, name) {
  if (checkNotEmpty(id)) {
    return id;
  }
  const suffix = name.trim()
    .toLowerCase()
    .replace(/\W+/g, '-')
    .replace(/[^a-z0-9-]+/g, '');
  return `ASCTB-TEMP:${suffix}`;
}

function checkNotEmpty(str) {
  return str && str.trim() !== "";
}

function removeDuplicates(array) {
  return Array.from(new Set(array.map(JSON.stringify)), JSON.parse);
}

function passIdFilterCriteria(context, id) {
  return isIdValid(id) || !context.excludeBadValues;
}

function passDoiFilterCriteria(context, doi) {
  return isDoiValid(doi) || !context.excludeBadValues;
}
