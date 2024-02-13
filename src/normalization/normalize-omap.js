import { readFileSync } from 'fs';
import { resolve } from 'path';
import { hash } from '../utils/hash.js';
import { info } from '../utils/logging.js';
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
    const normalizedData = normalizeData(context, rawData);
    writeNormalizedData(context, normalizedData);
    return 'omap';
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
    core_antibody_panel: normalizeCoreAntibodyPanelData(context, data),
  };
}

function normalizeAntibodyData(context, data) {
  return data.map((row) => {
    return new ObjectBuilder()
      .append('antibody_id', getAntibodyIri(row.rrid))
      .append('parent_class', 'ccf:Antibody')
      .append('host', row.host)
      .append('isotype', row.isotype)
      .append('clonality', row.clonality)
      .append('clone_id', `${row.clone_id}`)
      .append('conjugate', row.conjugate)
      .append('fluorescent', row.fluorescent_reporter)
      .append('recombinant', row.recombinant)
      .append('producer', row.vendor)
      .append('catalog_number', `${row.catalog_number}`)
      .append(
        'detects',
        split(row.HGNC_ID)?.map((text) => normalizeProteinId(text))
      )
      .append('rationale', row.rationale)
      .build();
  });
}

function normalizeExperimentData(context, metadata, data) {
  const referenceData = data[0]; // Use the first data as the reference
  const cycle_ids = data.map((row) => getExperimentCycleIri(context, row.omap_id, row.cycle_number));
  return new ObjectBuilder()
    .append('id', getExperimentIri(context, referenceData.omap_id))
    .append('label', `${referenceData.omap_id} experiment`)
    .append('class_type', 'MultiplexedAntibodyBasedImagingExperiment')
    .append('typeOf', ['MultiplexedAntibodyBasedImagingExperiment'])
    .append('method', referenceData.method)
    .append('tissue_preservation', referenceData.tissue_preservation)
    .append(
      'protocol_doi',
      split(referenceData.protocol_doi)?.map((text) => normalizeDoi(text))
    )
    .append('author_orcid', split(referenceData.author_orcid))
    .append('has_cycle', [...new Set(cycle_ids)])
    .append('sample_organ', referenceData.organ_uberon)
    .build();
}

function normalizeExperimentCycleData(context, data) {
  const omapId = data[0].omap_id;
  const cycleNumbers = [...new Set(data.map((row) => row.cycle_number))];
  const cycles = [];
  for (let index = 0; index < cycleNumbers.length; index++) {
    const cycleNumber = cycleNumbers[index];
    cycles.push(
      new ObjectBuilder()
        .append('id', getExperimentCycleIri(context, omapId, cycleNumber))
        .append('label', `${omapId} experiment, Cycle ${cycleNumber}`)
        .append('class_type', 'ExperimentCycle')
        .append('typeOf', ['ExperimentCycle'])
        .append('cycle_number', cycleNumber)
        .append(
          'uses_antibody',
          data
            .filter((row) => row.cycle_number === cycleNumber)
            .map((row) => {
              return new ObjectBuilder()
                .append('id', getExperimentalAntibodyIri(context, omapId, row.rrid, row.dilution))
                .append('label', getExperimentalAntibodyLabel(omapId, row.rrid, row.dilution))
                .append('class_type', 'ExperimentUsedAntibody')
                .append('typeOf', ['ExperimentUsedAntibody'])
                .append('concentration', row.concentration_value)
                .append('dilution', row.dilution)
                .append(
                  'based_on',
                  new ObjectBuilder()
                    .append('id', getCustomOrCommercialAntibodyIri(context, omapId, row.rrid, row.lot_number))
                    .append('label', getCustomOrCommercialAntibodyLabel(omapId, row.rrid, row.lot_number))
                    .append('class_type', 'RegisteredAntibody')
                    .append('typeOf', [getAntibodyIri(row.rrid)])
                    .append('lot_number', `${row.lot_number ? row.lot_number : ''}`)
                    .build()
                )
                .build();
            })
        )
        .build()
    );
  }
  return cycles;
}

function normalizeCoreAntibodyPanelData(context, data) {
  const omapId = data[0].omap_id;
  const antibodyComponents = data
    .filter((row) => row.core_panel === 'Y')
    .map((row) => getExperimentalAntibodyIri(context, omapId, row.rrid, row.dilution));
  return new ObjectBuilder()
    .append('id', getCoreAntibodyPanelIri(context, antibodyComponents))
    .append('label', getCoreAntibodyPanelLabel(omapId))
    .append('class_type', 'CoreAntibodyPanel')
    .append('typeOf', ['CoreAntibodyPanel'])
    .append('has_antibody_component', antibodyComponents)
    .build();
}

function getPurl(context) {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.purlIri}${type}/${name}/${version}`;
}

function getExperimentIri(context, omapId) {
  return `${getPurl(context)}#${omapId}`;
}

function getExperimentCycleIri(context, omapId, cycleNumber) {
  return `${getPurl(context)}#${omapId}-cycle-${cycleNumber}`;
}

function getExperimentalAntibodyIri(context, omapId, antibodyId, dilution) {
  const label = getExperimentalAntibodyLabel(omapId, antibodyId, dilution);
  return `${getPurl(context)}#${hash(label)}`;
}

function getExperimentalAntibodyLabel(omapId, antibodyId, dilution) {
  return `${antibodyId} antibody, diluted by ${dilution ? dilution : 'unknown'}, used in ${omapId} experiment`;
}

function getCustomOrCommercialAntibodyIri(context, omapId, antibodyId, lotNumber) {
  const label = getCustomOrCommercialAntibodyLabel(omapId, antibodyId, lotNumber);
  return `${getPurl(context)}#${hash(label)}`;
}

function getCustomOrCommercialAntibodyLabel(omapId, antibodyId, lotNumber) {
  return `${antibodyId} antibody, lot number ${lotNumber ? lotNumber : 'unknown'}, used in ${omapId} experiment`;
}

function getCoreAntibodyPanelIri(context, antibodyComponents) {
  const label = antibodyComponents.toString();
  return `${getPurl(context)}#${hash(label)}`;
}

function getCoreAntibodyPanelLabel(omapId) {
  return `${omapId} core antibody panel`;
}

function getAntibodyIri(antibodyId) {
  return `http://identifiers.org/rrid/RRID:${antibodyId}`;
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
    return text.split(',').map((s) => s.trim());
  }
  return null;
}
