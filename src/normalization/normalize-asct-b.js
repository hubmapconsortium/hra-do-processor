import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import Papa from 'papaparse';
import { resolve } from 'path';
import sh from 'shelljs';
import { info, more, warning } from '../utils/logging.js';
import { makeASCTBData } from './asct-b-utils/api.functions.js';
import { BM_TYPE } from './asct-b-utils/api.model.js';
import {
  getPatchesForAnatomicalStructure,
  getPatchesForBiomarker,
  getPatchesForCellType,
  isAsIdValid,
  isCtIdValid,
  isIdValid,
  normalizeDoi,
  normalizeString
} from './patches.js';
import { normalizeMetadata, readMetadata, writeNormalizedData, writeNormalizedMetadata } from './utils.js';

export function normalizeAsctbMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalizeAsctbData(context) {
  const rawData = (await getRawData(context)).data;
  const normalizedData = normalizeData(context, rawData);
  writeNormalizedData(context, normalizedData);
}

export async function getRawData(context) {
  const { path } = context.selectedDigitalObject;

  const metadata = readMetadata(context);
  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;
  let csvData;
  if (dataUrl.startsWith('http')) {
    csvData = await fetch(dataUrl).then((r) => r.text());
  } else {
    csvData = readFileSync(resolve(path, 'raw', dataUrl)).toString();
  }
  const csvRows = Papa.parse(csvData, { skipEmptyLines: 'greedy' }).data;
  const data = makeASCTBData(csvRows);
  info(`Reading data: ${dataUrl}`);

  // If warnings are found in the response, save for reference.
  const warningsFile = resolve(path, 'normalized/warnings.yaml');
  sh.rm('-f', warningsFile); // Clear previous warnings file
  if (!context.skipValidation && data.warnings?.length > 0) {
    writeFileSync(warningsFile, dump(data.warnings));
    warning('Warnings were reported by the ASCTB-API. This may indicate further errors that need resolved.');
    more(`Please review the warnings at ${warningsFile}`);
  }

  return data;
}

function normalizeData(context, data) {
  const { excludeBadValues } = context;
  if (excludeBadValues) {
    warning(
      `Option '--exclude-bad-values' is used to exclude invalid values. The resulting data may be lessen than the raw data.`
    );
  }
  return {
    anatomical_structures: normalizeAsData(context, data),
    cell_types: normalizeCtData(context, data),
    biomarkers: normalizeBmData(context, data),
    asctb_record: normalizeAsctbRecord(context, data),
    cell_marker_descriptor: normalizeCellMarkerDescriptor(context, data)
  };
}

function normalizeAsData(context, data) {
  return data.reduce((collector, row) => {
    row.anatomical_structures
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => {
        return {
          id: generateIdWhenEmpty(id, name),
          name: name,
          is_provisional: !checkNotEmpty(id),
        };
      })
      .filter(({ id }) => passAsIdFilterCriteria(context, id))
      .reduce(normalizeAs, collector);
    return collector;
  }, getPatchesForAnatomicalStructure(context));
}

function normalizeAs(collector, { id: as_id, name: as_name, is_provisional }, index, array) {
  const foundEntity = collector.find((entityInCollector) => entityInCollector.id === as_id);
  if (foundEntity) {
    const oldPartOf = foundEntity.ccf_part_of;
    const newPartOf = [...oldPartOf, getPartOfEntity(array, index)];
    foundEntity.ccf_part_of = removeDuplicates(newPartOf);
  } else {
    const obj = {
      id: as_id,
      conforms_to: 'AnatomicalStructure',
      ccf_pref_label: as_name.trim(),
      ccf_asctb_type: 'AS',
      ccf_is_provisional: is_provisional,
      ccf_part_of: [getPartOfEntity(array, index)],
    };
    if (is_provisional) {
      obj['parent_class'] = 'ccf:AnatomicalStructure';
      obj['label'] = as_name.trim();
    }
    collector.push(obj);
  }
  return collector;
}

function getPartOfEntity(array, index) {
  return index === 0
    ? 'UBERON:0013702' // body proper
    : array[index - 1].id; // previous array item
}

function normalizeCtData(context, data) {
  return data.reduce((collector, row) => {
    row.cell_types
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => {
        return {
          id: generateIdWhenEmpty(id, name),
          name: name,
          is_provisional: !checkNotEmpty(id),
        };
      })
      .filter(({ id }) => passCtIdFilterCriteria(context, id))
      .reduce(normalizeCt, collector);

    // Add ccf_located_in relationship that is between AS and CT
    const valid_as = row.anatomical_structures
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => generateIdWhenEmpty(id, name))
      .filter((id) => passAsIdFilterCriteria(context, id));
    const valid_ct = row.cell_types
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => generateIdWhenEmpty(id, name))
      .filter((id) => passCtIdFilterCriteria(context, id));
    // Each CT will be associated with all AS via the ccf_located_in relationship
    valid_ct.forEach((ct) => {
      valid_as.forEach((as) => addLocatedIn(collector, ct, as))
    });

    // Add has_biomarker relationship between CT and BM
    const biomarkers = row.biomarkers
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => generateIdWhenEmpty(id, name))
      .filter((id) => passIdFilterCriteria(context, id));

    // Get the references
    const references = row.references
      .map((ref) => {
        const refString = checkNotEmpty(ref.id) ? ref.id : "N/A";
        return checkIsDoi(refString) ? normalizeDoi(refString) : normalizeString(refString);
      });

    // Get the last cell type as the primary cell
    const last_ct = valid_ct.pop();
    if (last_ct) {
      addCharacterizingBiomarkers(collector, last_ct, biomarkers, references);
    }
    return collector;
  }, getPatchesForCellType());
}

function normalizeCt(collector, { id: ct_id, name: ct_name, is_provisional }, index, array) {
  const foundEntity = collector.find((entityInCollector) => entityInCollector.id === ct_id);
  if (foundEntity) {
    const oldCtIsa = foundEntity.ccf_ct_isa;
    const newCtIsa = [...oldCtIsa, getCtIsaEntity(array, index)];
    foundEntity.ccf_ct_isa = removeDuplicates(newCtIsa);
  } else {
    const obj = {
      id: ct_id,
      conforms_to: 'CellType',
      ccf_pref_label: ct_name.trim(),
      ccf_asctb_type: 'CT',
      ccf_is_provisional: is_provisional,
      ccf_ct_isa: [getCtIsaEntity(array, index)],
      ccf_located_in: [],
      has_characterizing_marker_set: [],
    };
    if (is_provisional) {
      obj['parent_class'] = 'ccf:CellType';
      obj['label'] = ct_name.trim();
    }
    collector.push(obj);
  }
  return collector;
}

function getCtIsaEntity(array, index) {
  return index === 0
    ? 'CL:0000000' // cell type
    : array[index - 1].id; // previous array item
}

function addLocatedIn(collector, cellType, anatomicalStructure) {
  const foundEntity = collector.find((entityInCollector) => entityInCollector.id === cellType);
  if (foundEntity) {
    const oldLocatedIn = foundEntity.ccf_located_in;
    const newLocatedIn = [...oldLocatedIn, anatomicalStructure];
    foundEntity.ccf_located_in = removeDuplicates(newLocatedIn);
  }
}

function addCharacterizingBiomarkers(collector, cellType, biomarkers, references) {
  const foundEntity = collector.find((entityInCollector) => entityInCollector.id === cellType);
  if (foundEntity) {
    const oldHasBiomarker = foundEntity.has_characterizing_marker_set;
    const newHasBiomarker = [
      ...oldHasBiomarker,
      {
        members: removeDuplicates(biomarkers),
        references: removeDuplicates(references),
      },
    ];
    foundEntity.has_characterizing_marker_set = removeDuplicates(newHasBiomarker);
  }
}

function normalizeBmData(context, data) {
  return data.reduce((collector, row) => {
    row.biomarkers
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name, b_type }) => {
        return {
          id: generateIdWhenEmpty(id, name),
          name: name,
          b_type: b_type,
          is_provisional: !checkNotEmpty(id),
        };
      })
      .filter(({ id }) => passIdFilterCriteria(context, id))
      .reduce(normalizeBm, collector);
    return collector;
  }, getPatchesForBiomarker());
}

function normalizeBm(collector, { id: bm_id, name: bm_name, b_type, is_provisional }, index, array) {
  const foundEntity = collector.find((entityInCollector) => entityInCollector.id === bm_id);
  if (!foundEntity) {
    const obj = {
      id: bm_id,
      conforms_to: 'Biomarker',
      ccf_pref_label: bm_name.trim(),
      ccf_asctb_type: 'BM',
      ccf_biomarker_type: b_type,
      ccf_is_provisional: is_provisional,
    };
    if (is_provisional) {
      obj['parent_class'] = 'ccf:Biomarker';
      obj['label'] = bm_name.trim();
    }
    collector.push(obj);
  }
  return collector;
}

function normalizeAsctbRecord(context, data) {
  return data.reduce((collector, row, index) => {
    // Determine record number
    const recordNumber = index + 1;

    // Generate anatomical structure instances
    const asInstances = row.anatomical_structures
      .map((item, order) => generateAsInstance(context, recordNumber, item, order))
      .filter(({ source_concept }) => passAsIdFilterCriteria(context, source_concept));

    // Generate cell type instances
    const ctInstances = row.cell_types
      .map((item, order) => generateCtInstance(context, recordNumber, item, order))
      .filter(({ source_concept }) => passCtIdFilterCriteria(context, source_concept));

    // Generate biomarker instances
    const bmInstances = row.biomarkers
      .map((item, order) => generateBmInstance(context, recordNumber, item, order))
      .filter(({ source_concept }) => passIdFilterCriteria(context, source_concept));

    // Populate all valid references
    const references = row.references
      .map((ref) => {
        const refString = checkNotEmpty(ref.id) ? ref.id : "N/A";
        return checkIsDoi(refString) ? normalizeDoi(refString) : normalizeString(refString);
      });

    // Collect all the items
    collector.push({
      id: generateAsctbRecordId(context, recordNumber),
      label: `Record ${recordNumber}`,
      type_of: [`AsctbRecord`],
      record_number: recordNumber,
      anatomical_structure_list: asInstances,
      cell_type_list: ctInstances,
      gene_marker_list: bmInstances.filter(({ ccf_biomarker_type }) => ccf_biomarker_type === BM_TYPE.G),
      protein_marker_list: bmInstances.filter(({ ccf_biomarker_type }) => ccf_biomarker_type === BM_TYPE.P),
      lipid_marker_list: bmInstances.filter(({ ccf_biomarker_type }) => ccf_biomarker_type === BM_TYPE.BL),
      metabolites_marker_list: bmInstances.filter(({ ccf_biomarker_type }) => ccf_biomarker_type === BM_TYPE.BM),
      proteoforms_marker_list: bmInstances.filter(({ ccf_biomarker_type }) => ccf_biomarker_type === BM_TYPE.BF),
      references: references
    });
    return collector;
  }, []);
}

function normalizeCellMarkerDescriptor(context, data) {
  return data.reduce((collector, row, index) => {
    // Determine record number
    const recordNumber = index + 1;

    // Get the last anatomical structure from the list as the primary
    const primaryAs = row.anatomical_structures
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => generateIdWhenEmpty(id, name))
      .filter((id) => passAsIdFilterCriteria(context, id))
      .pop();

    // Get the last cell type from the list as the primary
    const primaryCt = row.cell_types
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => ({
        id: generateIdWhenEmpty(id, name),
        name
      }))
      .filter(({ id }) => passCtIdFilterCriteria(context, id))
      .pop();

    // Populate all valid biomarker concepts
    const biomarkers = row.biomarkers
      .filter(({ id, name }) => checkNotEmpty(id) || checkNotEmpty(name))
      .map(({ id, name }) => generateIdWhenEmpty(id, name))
      .filter((id) => passIdFilterCriteria(context, id));

    // Populate all valid references
    const references = row.references
      .map((ref) => {
        const refString = checkNotEmpty(ref.id) ? ref.id : "N/A";
        return checkIsDoi(refString) ? normalizeDoi(refString) : normalizeString(refString);
      });

    // Collect all the items if the components are complete.
    if (primaryAs && primaryCt && biomarkers) {
      collector.push({
        id: generateCellMarkerDescriptorId(context, recordNumber),
        label: `Cell marker descriptor for ${primaryCt.name}`,
        type_of: [`CellMarkerDescriptor`],
        primary_cell_type: primaryCt.id,
        primary_anatomical_structure: primaryAs,
        biomarker_set: biomarkers,
        references: references,
        derived_from: generateAsctbRecordId(context, recordNumber)
      });
    }
    return collector;
  }, []);
}

function generateAsInstance(context, recordNumber, data, index) {
  const { name: doName } = context.selectedDigitalObject
  const { id, name } = data;
  const asName = normalizeString(name);
  const orderNumber = index + 1
  return {
    id: generateAsInstanceId(context, recordNumber, orderNumber),
    label: `${asName} (${doName}-R${recordNumber}-AS${orderNumber})`,
    type_of: [generateIdWhenEmpty(id, asName)],
    ccf_pref_label: asName,
    source_concept: generateIdWhenEmpty(id, asName),
    record_number: recordNumber,
    order_number: orderNumber
  }
}

function generateCtInstance(context, recordNumber, data, index) {
  const { name: doName } = context.selectedDigitalObject
  const { id, name } = data;
  const ctName = normalizeString(name);
  const orderNumber = index + 1
  return {
    id: generateCtInstanceId(context, recordNumber, orderNumber),
    label: `${ctName} (${doName}-R${recordNumber}-CT${orderNumber})`,
    type_of: [generateIdWhenEmpty(id, ctName)],
    ccf_pref_label: ctName,
    source_concept: generateIdWhenEmpty(id, ctName),
    record_number: recordNumber,
    order_number: orderNumber
  }
}

function generateBmInstance(context, recordNumber, data, index) {
  const { name: doName } = context.selectedDigitalObject
  const { id, name, b_type } = data;
  const bmName = normalizeString(name);
  const orderNumber = index + 1
  return {
    id: generateBmInstanceId(context, recordNumber, orderNumber),
    label: `${bmName} (${doName}-R${recordNumber}-BM${orderNumber})`,
    type_of: [generateIdWhenEmpty(id, bmName)],
    ccf_pref_label: bmName,
    ccf_biomarker_type: b_type,
    source_concept: generateIdWhenEmpty(id, bmName),
    record_number: recordNumber,
    order_number: orderNumber
  }
}

function generateAsctbRecordId(context, recordNumber) {
  const { type: doType, name: doName, version: doVersion } = context.selectedDigitalObject;
  return `${context.purlIri}${doType}/${doName}/${doVersion}#R${recordNumber}`;
}

function generateAsInstanceId(context, recordNumber, orderNumber) {
  const { type: doType, name: doName, version: doVersion } = context.selectedDigitalObject;
  return `${context.purlIri}${doType}/${doName}/${doVersion}#R${recordNumber}-AS${orderNumber}`;
}

function generateCtInstanceId(context, recordNumber, orderNumber) {
  const { type: doType, name: doName, version: doVersion } = context.selectedDigitalObject;
  return `${context.purlIri}${doType}/${doName}/${doVersion}#R${recordNumber}-CT${orderNumber}`;
}

function generateBmInstanceId(context, recordNumber, orderNumber) {
  const { type: doType, name: doName, version: doVersion } = context.selectedDigitalObject;
  return `${context.purlIri}${doType}/${doName}/${doVersion}#R${recordNumber}-BM${orderNumber}`;
}

function generateCellMarkerDescriptorId(context, recordNumber) {
  const { type: doType, name: doName, version: doVersion } = context.selectedDigitalObject;
  return `${context.purlIri}${doType}/${doName}/${doVersion}#R${recordNumber}-cell-marker-descriptor`;
}

function generateIdWhenEmpty(id, name) {
  return checkNotEmpty(id) ? id : generateId(name);
}

function generateId(name) {
  return `https://purl.org/ccf/ASCTB-TEMP_${normalizeName(name)}`;
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\W+/g, '-')
    .replace(/[^a-z0-9-]+/g, '');
}

function checkNotEmpty(str) {
  return str && str.trim() !== '';
}

function checkIsDoi(str) {
  const doiRegex = /(10\.\d{4,9}\/[\w\-._;()/:]+)/i;
  return doiRegex.test(str);
}

function removeDuplicates(array) {
  return Array.from(new Set(array.map(JSON.stringify)), JSON.parse);
}

function passIdFilterCriteria(context, id) {
  return isIdValid(id) || !context.excludeBadValues;
}

function passAsIdFilterCriteria(context, id) {
  return isAsIdValid(id) || !context.excludeBadValues;
}

function passCtIdFilterCriteria(context, id) {
  return isCtIdValid(id) || !context.excludeBadValues;
}