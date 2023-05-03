import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { validateNormalized } from '../utils/validation.js';
import { header, info, warning, more } from '../utils/logging.js';
import { readMetadata, 
         writeNormalized, 
         getPatchesForAnatomicalStructure, 
         getPatchesForCellType, 
         getPatchesForBiomarker } from './utils.js';

const ASCTB_API = 'https://mmpyikxkcp.us-east-2.awsapprunner.com/';

export async function normalizeAsctb(context) {
  header(context, 'run-normalize');
  const rawData = await getRawData(context);
  const normalizedData = normalizeRawData(context, rawData);
  writeNormalized(context, normalizedData);
  validateNormalized(context);
}

async function getRawData(context) {
  const { path } = context.selectedDigitalObject;

  const metadata = readMetadata(path);
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

function normalizeRawData(context, data) {
  return {
    anatomical_structures: normalizeAsData(context, data),
    cell_types: normalizeCtData(data),
    biomarkers: normalizeBmData(data),
  };
}

function normalizeAsData(context, data) {
  return data.reduce((collector, row) => {
    row.anatomical_structures.reduce(normalizeAs, collector);
    return collector;
  }, getPatchesForAnatomicalStructure(context));
}

function normalizeAs(collector, {id, name}, index, array) {
  if (checkIfValid({id, name})) {
    const foundEntity = collector.find(
      (entity) => entity.id === generateIdWhenEmpty(id, name)
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
        id: generateIdWhenEmpty(id, name),
        class_type: "AnatomicalStructure",
        ccf_pref_label: name,
        ccf_asctb_type: "AS",
        ccf_is_provisional: !checkNotEmpty(id),
        ccf_part_of: [ getPartOfEntity(array, index) ], 
      });
    }
  }
  return collector;
}

function getPartOfEntity(array, index) {
  return (index === 0) 
    ? "UBERON:0013702" // body proper
    : generateIdWhenEmpty(array[index-1].id, array[index-1].name)
}

function normalizeCtData(data) {
  return data.reduce((collector, row) => {
    row.cell_types.reduce(normalizeCt, collector);

    // Add ccf_located_in relationship that is between AS and CT
    const last_as = row.anatomical_structures.pop();
    const last_ct = row.cell_types.pop();
    if (last_ct) {
      addLocatedIn(collector, last_as, last_ct);
    }
    // Add has_biomarker relationship between CT and BM
    const biomarkers = row.biomarkers.filter(({id, name}) => checkIfValid({id, name}));
    const references = row.references.filter(({doi}) => checkNotEmpty(doi));
    if (last_ct) {
      addCharacterizingBiomarkers(collector, last_ct, biomarkers, references);
    }
    return collector;
  }, getPatchesForCellType())
}

function normalizeCt(collector, {id, name}, index, array) {
  if (checkIfValid({id, name})) {
    const foundEntity = collector.find(
      (entity) => entity.id === generateIdWhenEmpty(id, name)
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
        id: generateIdWhenEmpty(id, name),
        class_type: "CellType",
        ccf_pref_label: name,
        ccf_asctb_type: "CT",
        ccf_is_provisional: !checkNotEmpty(id),
        ccf_ct_isa: [ getCtIsaEntity(array, index) ], 
        ccf_located_in: [],
        ccf_has_biomarker_set: [],
      });
    }
  }
  return collector;
}

function getCtIsaEntity(array, index) {
  return (index === 0) 
    ? "CL:0000000" // cell type
    : generateIdWhenEmpty(array[index-1].id, array[index-1].name)
}

function normalizeBmData(data) {
  return data.reduce((collector, row) => {
    row.biomarkers.reduce(normalizeBm, collector);
    return collector;
  }, getPatchesForBiomarker())
}
function normalizeBm(collector, {id, name, b_type}, index, array) {
  if (checkNotEmpty(id) || checkNotEmpty(name)) {
    const foundEntity = collector.find(
      (entity) => entity.id === generateIdWhenEmpty(id, name)
    );
    if (!foundEntity) {
      collector.push({
        id: generateIdWhenEmpty(id, name),
        class_type: "Biomarker",
        ccf_pref_label: name,
        ccf_asctb_type: "BM",
        ccf_biomarker_type: b_type,
        ccf_is_provisional: !checkNotEmpty(id),
      });
    }
  }
  return collector;
}

function addLocatedIn(array, {id: as_id, name: as_name}, {id: ct_id, name: ct_name}) {
  const foundEntity = array.find(
    (entity) => entity.id === generateIdWhenEmpty(ct_id, ct_name)
  );
  if (foundEntity) {
    const oldLocatedIn = foundEntity.ccf_located_in;
    const newLocatedIn = [
      ...oldLocatedIn,
      generateIdWhenEmpty(as_id, as_name)
    ];
    foundEntity.ccf_located_in = removeDuplicates(newLocatedIn);
  }
}

function addCharacterizingBiomarkers(array, {id: ct_id, name: ct_name}, biomarkers, references) {
  const foundEntity = array.find(
    (entity) => entity.id === generateIdWhenEmpty(ct_id, ct_name)
  );
  if (foundEntity) {
    const oldHasBiomarker = foundEntity.ccf_has_biomarker_set;
    const newHasBiomarker = [
      ...oldHasBiomarker,
      { 
        members: removeDuplicates(biomarkers.map(
          ({id: bm_id, name: bm_name}) => generateIdWhenEmpty(bm_id, bm_name)
        )),
        references: removeDuplicates(references.map(
          ({doi}) => normalizeDoi(doi)
        ))
      }
    ];
    foundEntity.ccf_has_biomarker_set = removeDuplicates(newHasBiomarker);
  }
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

function checkIfValid({id, name}) {
  return checkNotEmpty(id) || checkNotEmpty(name);
}

function checkNotEmpty(str) {
  return str && str.trim() !== "";
}

function normalizeDoi(doi) {
  return doi.replace(/\s+/g, '')
            .replace(/^doi:/, 'DOI:')
            .replace(/^(https:\/\/)?doi\.org\//, 'DOI:');
}

function removeDuplicates(array) {
  return Array.from(new Set(array.map(JSON.stringify)), JSON.parse);
}
