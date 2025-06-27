import { error } from 'console';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { hash } from '../utils/hash.js';
import { info, warning } from '../utils/logging.js';
import { ObjectBuilder } from '../utils/object-builder.js';
import { normalizeBasicData } from './normalize-basic.js';
import { makeOMAPData } from './omap-utils/api.functions.js';
import { normalizeDoi } from './patches.js';
import { normalizeMetadata, readMetadata, writeNormalizedData, writeNormalizedMetadata } from './utils.js';

export function normalizeOmapMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalizeOmapData(context) {
  const rawData = await getRawData(context);
  if (rawData.length === 0) {
    normalizeBasicData(context);
    return 'basic';
  } else {
    try {
      const normalizedData = normalizeData(context, rawData);
      writeNormalizedData(context, normalizedData);
      return 'omap';
    } catch (err) {
      const doString = context.selectedDigitalObject.doString;
      error(err);
      warning(`Failed to process OMAP data (${err.message}), switching to Basic Processing for ${doString}.`);
      normalizeBasicData(context);
      return 'basic';
    }
  }
}

export async function getRawData(context) {
  const { path } = context.selectedDigitalObject;
  const metadata = readMetadata(context);
  const dataTables = [metadata.datatable].flat();
  const dataUrl = dataTables.find((file) => file.endsWith('.csv'));

  info(`Reading data: ${dataUrl}`);

  let csvData;
  if (dataUrl.startsWith('http')) {
    csvData = await fetch(dataUrl).then((r) => r.text());
  } else {
    csvData = readFileSync(resolve(path, 'raw', dataUrl)).toString();
  }
  const omapData = makeOMAPData(csvData);
  return omapData;
}

function normalizeData(context, data) {
  const metadata = readMetadata(context);
  return {
    antibody: normalizeAntibodyData(context, data),
    experiment: normalizeExperimentData(context, metadata, data),
    cycles: normalizeExperimentCycleData(context, data),
    antibody_panel: normalizeAntibodyPanelData(context, data),
  };
}

function normalizeAntibodyData(context, data) {
  return data
    .map((row) => {
      return new ObjectBuilder()
        .append('id', getAntibodyIri(row.rrid))
        .append('parent_class', 'ccf:Antibody')
        .append('antibody_type', row.HGNC_ID ? 'Primary' : 'Secondary')
        .append('host', row.host)
        .append('clonality', row.clonality)
        .append('clone_id', `${row.clone_id}`)
        .append('conjugate', row.conjugate)
        .append('fluorescent', row.fluorescent_reporter)
        .append('recombinant', row.recombinant)
        .append('producer', row.vendor)
        .append('catalog_number', `${row.catalog_number}`)
        .build();
    })
    .reduce(mergeDuplicateAntibodyData, []);
}

function mergeDuplicateAntibodyData(acc, item) {
  // Find if the item with the same id already exists in the output array
  let existingItem = acc.find((el) => el.id === item.id);
  if (!existingItem) {
    // Create new structure
    const { detects, binds_to, rationale, ...rest } = item;
    existingItem = rest;
    acc.push(existingItem);
  }
  return acc;
}

function normalizeExperimentData(context, metadata, data) {
  const referenceData = data[0]; // Use the first data as the reference
  const cycle_ids = data.map((row) => getExperimentCycleIri(context, row.omap_id, row.cycle_number));
  return new ObjectBuilder()
    .append('id', getExperimentIri(context, referenceData.omap_id))
    .append('label', `${referenceData.omap_id} experiment`)
    .append('type_of', ['ccf:MultiplexedAntibodyBasedImagingExperiment'])
    .append('study_method', referenceData.method)
    .append('tissue_preservation', referenceData.tissue_preservation)
    .append(
      'protocol_doi',
      split(referenceData.protocol_doi)?.map((text) => normalizeDoi(text))
    )
    .append('author_orcid', split(referenceData.author_orcids || referenceData.author_orcid))
    .append('has_cycle', [...new Set(cycle_ids)])
    .append('sample_organ', referenceData.organ_uberon)
    .build();
}

function normalizeExperimentCycleData(context, data) {
  const omapId = data[0].omap_id;
  const uniqueCycleNumbers = [...new Set(data.map(row => row.cycle_number))];
  return uniqueCycleNumbers.map(cycleNumber => 
    createExperimentCycle(context, omapId, cycleNumber, data)
  );
}

function createExperimentCycle(context, omapId, cycleNumber, allData) {
  const cycleData = allData.filter(row => row.cycle_number === cycleNumber);
  const uniqueAntibodies = removeDuplicateAntibodies(cycleData);
  return new ObjectBuilder()
    .append('id', getExperimentCycleIri(context, omapId, cycleNumber))
    .append('label', `${omapId} experiment, Cycle ${cycleNumber}`)
    .append('type_of', ['ccf:ExperimentCycle'])
    .append('cycle_number', cycleNumber)
    .append('uses_antibodies', uniqueAntibodies.map(row => 
      createUsedAntibodyObject(context, omapId, cycleNumber, row, allData)
    ))
    .build();
}

function removeDuplicateAntibodies(cycleData) {
  return cycleData.filter((row, index, array) => {
    const isFirstOccurrence = getRowIndexFromAllData(row, array) === index;
    return isFirstOccurrence;
  });
}

function getRowIndexFromAllData(row, allData) {
  return allData.findIndex(dataRow => 
    dataRow.rrid === row.rrid && 
    dataRow.HGNC_ID === row.HGNC_ID &&
    dataRow.conjugate === row.conjugate &&
    dataRow.lot_number === row.lot_number &&
    dataRow.dilution === row.dilution &&
    dataRow.concentration_value === row.concentration_value
  );
}

function createUsedAntibodyObject(context, omapId, cycleNumber, row, allData) {
  const antibodyObject = new ObjectBuilder()
    .append('id', getDilutedAntibodyInstanceIri(
      context, omapId, cycleNumber, row.rrid, row.lot_number, 
      row.dilution, row.concentration_value
    ))
    .append('label', getDilutedAntibodyInstanceLabel(
      row.rrid, row.lot_number, row.dilution, row.concentration_value
    ))
    .append('type_of', ['ccf:ExperimentUsedAntibody'])
    .append('record_number', getRowIndexFromAllData(row, allData) + 1)
    .append('antibody_id', getAntibodyIri(row.rrid))
    .append('concentration', row.concentration_value)
    .append('dilution', row.dilution)
    .append('cycle_number', cycleNumber)
    .append('is_core_panel', row.core_panel === 'Y')
    .append('used_by_experiment', getExperimentIri(context, omapId))
    .append('based_on', createAntibodyInstanceObject(context, row))
    .build();

  addDetectionOrBindingInfo(antibodyObject, row, allData);
  return antibodyObject;
}

function createAntibodyInstanceObject(context, row) {
  return new ObjectBuilder()
    .append('id', getAntibodyInstanceIri(context, row.rrid, row.lot_number))
    .append('label', getAntibodyInstanceLabel(row.rrid, row.lot_number))
    .append('type_of', [getAntibodyIri(row.rrid)])
    .append('lot_number', row.lot_number ? `${row.lot_number}` : null)
    .append('isotype', row.isotype)
    .build();
}

function addDetectionOrBindingInfo(antibodyObject, row, allData) {
  if (row.HGNC_ID) {
    antibodyObject.detects = {
      protein_id: split(row.HGNC_ID).map(text => normalizeProteinId(text)),
      rationale: row.rationale
    };
  } else {
    const rowIndex = getRowIndexFromAllData(row, allData);
    const previousRow = allData[rowIndex - 1];
    if (previousRow) {
      antibodyObject.binds_to = {
        antibody_id: getAntibodyIri(previousRow.rrid),
        rationale: row.rationale
      };
    }
  }
}

function normalizeAntibodyPanelData(context, data) {
  const omapId = data[0].omap_id;
  const antibodyComponents = data
    .map((row) =>
      getDilutedAntibodyInstanceIri(
        context,
        omapId,
        row.cycle_number,
        row.rrid,
        row.lot_number,
        row.dilution,
        row.concentration_value
      )
    );
  return new ObjectBuilder()
    .append('id', getAntibodyPanelIri(context, omapId))
    .append('label', getAntibodyPanelLabel(omapId))
    .append('type_of', ['ccf:AntibodyPanel'])
    .append('contains_antibodies', antibodyComponents)
    .build();
}

function getPurl(context) {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.purlIri}${type}/${name}/${version}`;
}

function getExperimentIri(context, omapId) {
  return `${getPurl(context)}#${omapId?.trim() ?? ''}`;
}

function getExperimentCycleIri(context, omapId, cycleNumber) {
  return `${getPurl(context)}#${omapId?.trim() ?? ''}-cycle-${cycleNumber}`;
}

function getDilutedAntibodyInstanceIri(context, omapId, cycleNumber, antibodyId, lotNumber, dilution, concentration) {
  const instanceKey = `${omapId}${cycleNumber}${antibodyId?.trim() ?? ''}${
    lotNumber ? `${lotNumber}`?.trim() ?? '' : 'NotAvailable'
  }${dilution ? dilution : concentration ? concentration : 'NotAvailable'}`;
  return `${getPurl(context)}#${antibodyId?.trim() ?? ''}-${hash(instanceKey)}`;
}

function getDilutedAntibodyInstanceLabel(antibodyId, lotNumber, dilution, concentration) {
  return `${antibodyId} antibody, ${lotNumber ? `lot number ${lotNumber}` : 'no lot number'}, ${
    dilution
      ? `with dilution ${dilution}`
      : concentration
      ? `with concentration ${concentration}`
      : 'unknown dilution factor or concentration value'
  }`;
}

function getAntibodyInstanceIri(context, antibodyId, lotNumber) {
  const instanceKey = `${antibodyId?.trim() ?? ''}${lotNumber ? `${lotNumber}`?.trim() ?? '' : 'NotAvailable'}`;
  return `${getPurl(context)}#${antibodyId?.trim() ?? ''}-${hash(instanceKey)}`;
}

function getAntibodyInstanceLabel(antibodyId, lotNumber) {
  return `${antibodyId} antibody, ${lotNumber ? `lot number ${lotNumber}` : 'no lot number'}`;
}

function getAntibodyPanelIri(context, omapId) {
  return `${getPurl(context)}#${omapId?.trim() ?? ''}-antibody-panel`;
}

function getAntibodyPanelLabel(omapId) {
  return `${omapId} antibody panel`;
}

function getAntibodyIri(antibodyId) {
  antibodyId = antibodyId?.trim() ?? '';
  if (antibodyId) {
    return `https://identifiers.org/RRID:${antibodyId}`;
  } else {
    throw new Error('Antibody IDs are required for each row');
  }
}

function normalizeProteinId(text) {
  if (!text.startsWith('HGNC:')) {
    return `HGNC:${text}`;
  }
  return removeWhitespaces(text);
}

function removeWhitespaces(s) {
  return s.replace(/ +/g, '');
}

function split(text) {
  if (text) {
    return text
      .split(/[\,\;]/)
      .map((s) => s.trim())
      .filter((s) => !!s);
  }
  return null;
}
