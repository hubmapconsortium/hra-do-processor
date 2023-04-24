import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { validateNormalized } from '../utils/validation.js';
import { readMetadata, writeNormalized } from './utils.js';

const ASCTB_API = 'https://mmpyikxkcp.us-east-2.awsapprunner.com/';

export async function normalizeAsctb(context) {
  const obj = context.selectedDigitalObject;
  const id = `http://purl.humanatlas.io/${context.selectedDigitalObject.doString}`
  const metadata = readMetadata(obj);

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
    const dataPath = resolve(obj.path, 'raw', dataUrl);
    formData.append(
      'csvFile',
      new Blob([readFileSync(dataPath).toString()], { type: 'text/csv', path: dataPath }),
      dataUrl
    );
    data = await fetch(requestUrl, { method: 'POST', body: formData }).then((r) => r.json());
  }
  const normalizedData = normalizeAsctbApiResponse(data.data);

  writeNormalized(obj, id, metadata, normalizedData);
  validateNormalized(context);

  // If warnings are found in the response, save for reference.
  const warningsFile = resolve(obj.path, 'normalized/warnings.yaml');
  sh.rm('-f', warningsFile); // Clear previous warnings file
  if (!context.skipValidation && data.warnings?.length > 0) {
    writeFileSync(warningsFile, dump({ warnings: data.warnings }));
    console.log(
      chalk.yellow('Warnings were reported by the ASCTB-API.'),
      'This may indicate further errors that need resolved. Please review the warnings at',
      warningsFile
    );
  }
}

function normalizeAsctbApiResponse(data) {
  return {
    anatomical_structures: data.reduce((collector, row) => {
      row.anatomical_structures.reduce(normalizeASData, collector);
      return collector;
    }, [{
      id: 'UBERON:0013702',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'body proper',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
    }]),
    cell_types: data.reduce((collector, row) => {
      row.cell_types.reduce(normalizeCTData, collector);

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
    }, [{
      id: 'CL:0000000',
      class_type: 'CellType',
      ccf_pref_label: 'cell type',
      ccf_asctb_type: 'CT',
      ccf_is_provisional: false,
    }]),
    biomarkers: data.reduce((collector, row) => {
      row.biomarkers.reduce(normalizeBMData, collector);
      return collector;
    }, []),
  };
}

function normalizeASData(accumulator, {id, name}, index, array) {
  if (checkIfValid({id, name})) {
    const foundEntity = accumulator.find(
      (entity) => entity.id === generateIdWhenEmpty(id, name)
    );
    if (foundEntity) {
      const oldPartOf = foundEntity.ccf_part_of;
      const newPartOf = [
        ...oldPartOf,
        getPartOfEntity(array, index),
      ];
      foundEntity.ccf_part_of = removeDuplicates(newPartOf);
    } 
    else {
      accumulator.push({
        id: generateIdWhenEmpty(id, name),
        class_type: "AnatomicalStructure",
        ccf_pref_label: name,
        ccf_asctb_type: "AS",
        ccf_is_provisional: !checkNotEmpty(id),
        ccf_part_of: [ getPartOfEntity(array, index) ], 
      });
    }
  }
  return accumulator;
}

function getPartOfEntity(array, index) {
  return (index === 0) 
    ? "UBERON:0013702" // body proper
    : generateIdWhenEmpty(array[index-1].id, array[index-1].name)
}

function normalizeCTData(accumulator, {id, name}, index, array) {
  if (checkIfValid({id, name})) {
    const foundEntity = accumulator.find(
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
      accumulator.push({
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
  return accumulator;
}

function getCtIsaEntity(array, index) {
  return (index === 0) 
    ? "CL:0000000" // cell type
    : generateIdWhenEmpty(array[index-1].id, array[index-1].name)
}

function normalizeBMData(accumulator, {id, name, b_type}, index, array) {
  if (checkNotEmpty(id) || checkNotEmpty(name)) {
    const foundEntity = accumulator.find(
      (entity) => entity.id === generateIdWhenEmpty(id, name)
    );
    if (!foundEntity) {
      accumulator.push({
        id: generateIdWhenEmpty(id, name),
        class_type: "Biomarker",
        ccf_pref_label: name,
        ccf_asctb_type: "BM",
        ccf_biomarker_type: b_type,
        ccf_is_provisional: !checkNotEmpty(id),
      });
    }
  }
  return accumulator;
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
  if (checkNotEmpty(id) && id.match(/\w+:\w+/)) {
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

function expandId(id) {
  return id
    .replace(/^UBERON:/, 'http://purl.obolibrary.org/obo/UBERON_')
    .replace(/^FMA:/, 'http://purl.org/sig/ont/fma/fma')
    .replace(/^CL:/, 'http://purl.obolibrary.org/obo/CL_')
    .replace(/^HGNC:/, 'http://identifiers.org/hgnc/')
    .replace(/^DOI:/, 'https://doi.org/')
    .replace(/\s+/g, '');
}

function normalizeDoi(doi) {
  return doi.replace(/\s+/g, '');
}

function removeDuplicates(array) {
  return Array.from(new Set(array.map(JSON.stringify)), JSON.parse);
}
