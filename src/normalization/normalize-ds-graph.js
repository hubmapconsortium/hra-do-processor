import { readFileSync } from 'fs';
import { resolve } from 'path';
import { info } from '../utils/logging.js';
import { checkIfValidUrl } from '../utils/validation.js';
import { ObjectBuilder } from '../utils/object-builder.js';
import {
  normalizeMetadata,
  readMetadata,
  writeNormalizedData,
  writeNormalizedMetadata,
  removeDuplicate
} from './utils.js';

export function normalizeDatasetGraphMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalizeDatasetGraphData(context) {
  const rawData = await getRawData(context);
  const normalizedData = normalizeData(context, rawData);
  writeNormalizedData(context, normalizedData);
}

export async function getRawData(context) {
  const { path } = context.selectedDigitalObject;
  const metadata = readMetadata(context);
  const dataTables = [metadata.datatable].flat();
  const dataUrl = dataTables.find((file) => file.endsWith('.jsonld'));

  info(`Reading data: ${dataUrl}`);

  let jsonData;
  if (dataUrl.startsWith('http')) {
    jsonData = await fetch(dataUrl).then((r) => r.text());
  } else {
    jsonData = readFileSync(resolve(path, 'raw', dataUrl)).toString();
  }
  const datasetGraphData = JSON.parse(jsonData);
  return datasetGraphData;
}

function normalizeData(context, data) {
  const metadata = readMetadata(context);
  return {
    donor: removeDuplicate(normalizeDonorData(data), ['id']),
    sample: removeDuplicate(normalizeSampleData(data), ['id']),
    dataset: removeDuplicate(normalizeDatasetData(data), ['id']),
    spatial_entity: removeDuplicate(normalizeExtractionSiteData(data), ['id'])
  }
}

function normalizeDonorData(data) {
  return data['@graph'].map(createDonorObject).filter(onlyNonNull);
}

function createDonorObject(donor) {
  if (!checkDonorId(donor['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', donor['@id'])
    .append('label', getDonorLabel(donor))
    .append('class_type', 'Donor')
    .append('typeOf', ['Donor'])
    .append('pref_label', donor.label)
    .append('description', donor.description)
    .append('external_link', donor.link)
    .append('age', donor.age)
    .append('sex', donor.sex)
    .append('sex_id', getSexId(donor.sex))
    .append('bmi', donor.bmi)
    .append('race', donor.race)
    .append('race_id', getRaceId(donor.race))
    .append('consortium_name', donor.consortium_name)
    .append('provider_name', donor.provider_name)
    .append('provider_uuid', donor.provider_uuid)
    .append('samples',
      donor.samples
        .map((sample) => sample['@id'])
        .filter(checkSampleId))
    .build();
}

function normalizeSampleData(data) {
  const donors = data['@graph'];
  return donors.map((donor) => {
    return donor['samples']
      .map((block) => createTissueBlockObject(donor, block))
      .filter(onlyNonNull)
  }).flat();
}

function createTissueBlockObject(donor, block) {
  if (!checkTissueBlockId(block['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', block['@id'])
    .append('label', getSampleLabel(block))
    .append('class_type', 'TissueBlock')
    .append('typeOf', ['TissueBlock'])
    .append('partially_overlaps', block.rui_location.ccf_annotations?.map((organ) => organ))
    .append('pref_label', block.label)
    .append('description', block.description)
    .append('rui_location', block.rui_location['@id'])
    .append('extraction_site', block.rui_location['@id'])
    .append('external_link', block.link)
    .append('sections', block.sections
      ?.map((section) => createTissueSectionObject(block, section))
      .filter(onlyNonNull))
    .append('datasets', block.datasets
      ?.map((dataset) => dataset['@id'])
      .filter(checkDatasetId))
    .append('section_count', block.section_count)
    .append('section_size', block.section_size)
    .append('section_size_unit', block.section_size_unit)
    .append('links_back_to', checkDonorId(donor['@id']))
    .build();
}

function createTissueSectionObject(block, section) {
  if (!checkTissueSectionId(section['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', section['@id'])
    .append('label', getSampleLabel(section))
    .append('class_type', 'TissueSection')
    .append('typeOf', ['TissueSection'])
    .append('pref_label', section.label)
    .append('description', section.description)
    .append('external_link', section.link)
    .append('section_number', section.section_number)
    .append('datasets', section.datasets
      ?.map((dataset) => dataset['@id'])
      .filter(checkDatasetId))
    .append('links_back_to', checkTissueBlockId(block['@id']))
    .build();
}

function normalizeDatasetData(data) {
  const donors = data['@graph']
  const sampleBlockDatasets = donors.map((donor) => {
    return donor['samples'].map((block) => {
      return block['datasets']?.map((dataset) => createDatasetObject(block, dataset))
    }).flat();
  }).flat();
  const sampleSectionDatasets = donors.map((donor) => {
    return donor['samples'].map((block) => {
      return block['sections']?.map((section) => {
        return section['datasets']?.map((dataset) => createDatasetObject(section, dataset))
      }).flat();
    }).flat();
  }).flat();
  return [...sampleBlockDatasets, ...sampleSectionDatasets].filter(onlyNonNull);
}

function createDatasetObject(sample, dataset) {
  if (!checkDatasetId(dataset['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', dataset['@id'])
    .append('label', getDatasetLabel(dataset))
    .append('class_type', 'Dataset')
    .append('typeOf', ['Dataset'])
    .append('pref_label', dataset.label)
    .append('description', dataset.description)
    .append('external_link', dataset.link)
    .append('technology', dataset.technology)
    .append('thumbnail', dataset.thumbnail)
    .append('links_back_to', checkSampleId(sample['@id']))
    .build();
}

function normalizeExtractionSiteData(data) {
  const donors = data['@graph'];
  return donors.map((donor) => {
    return donor['samples'].map((block) =>
      createExtractionSiteObject(block, block['rui_location'])
    ).filter(onlyNonNull);
  }).flat();
}

function createExtractionSiteObject(block, spatialEntity) {
  if (!checkExtractionSiteId(spatialEntity['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', spatialEntity['@id'])
    .append('label', getSpatialEntityLabel(block))
    .append('pref_label', spatialEntity.label)
    .append('class_type', 'SpatialEntity')
    .append('typeOf', ['SpatialEntity'])
    .append('collides_with', spatialEntity.ccf_annotations)
    .append('create_date', normalizeDate(spatialEntity.creation_date))
    .append('creator', spatialEntity.creator)
    .append('x_dimension', spatialEntity.x_dimension)
    .append('y_dimension', spatialEntity.y_dimension)
    .append('z_dimension', spatialEntity.z_dimension)
    .append('dimension_unit', spatialEntity.dimension_units)
    .append('slice_count', spatialEntity.slice_count)
    .append('slice_thickness', spatialEntity.slice_thickness)
    .append('placement', createPlacementObject(block, spatialEntity.placement))
    .build();
}

function createPlacementObject(block, placement) {
  if (!checkPlacementId(placement['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', placement['@id'])
    .append('label', getPlacementLabel(block))
    .append('class_type', 'SpatialPlacement')
    .append('typeOf', ['SpatialPlacement'])
    .append('pref_label', placement.label)
    .append('placement_date', normalizeDate(placement.placement_date))
    .append('target', placement.target)
    .append('x_rotation', placement.x_rotation)
    .append('y_rotation', placement.y_rotation)
    .append('z_rotation', placement.z_rotation)
    .append('rotation_unit', placement.rotation_units)
    .append('rotation_order', placement.rotation_order)
    .append('x_scaling', placement.x_scaling)
    .append('y_scaling', placement.y_scaling)
    .append('z_scaling', placement.z_scaling)
    .append('scaling_unit', placement.scaling_units)
    .append('x_translation', placement.x_translation)
    .append('y_translation', placement.y_translation)
    .append('z_translation', placement.z_translation)
    .append('translation_unit', placement.translation_units)
    .build();
}

function normalizeDate(originalDate) {
  const date = new Date(originalDate);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

function getDonorLabel(donor) {
  const { race, sex, age, bmi, provider_name } = donor;
  return `Donor ${sex}, Race ${race}, Age ${age}, BMI ${bmi} from ${provider_name}`;
}

function getSampleLabel(sample) {
  const { sample_type, description } = sample;
  return `${sample_type} (${description})`;
}

function getDatasetLabel(dataset) {
  const { technology, label } = dataset;
  return `${technology} dataset (${label})`;
}

function getSpatialEntityLabel(sample) {
  return `Spatial entity of ${getSampleLabel(sample)}`
}

function getPlacementLabel(sample) {
  return `Spatial placement of ${getSampleLabel(sample)}`
}

function getSexId(sex) {
  if (!sex) {
    return null;
  }
  switch (sex.toLowerCase) {
    case "male": return "loinc:LA2-8";
    case "female": return "loinc:LA3-6";
    default: return "loinc:LA4489-6"
  }
}

function getRaceId(race) {
  if (!race) {
    return null;
  }
  const raceLabel = race.toLowerCase();
  if (raceLabel.includes("white")) {
    return "loinc:LA4457-3";
  } else if (raceLabel.includes("american indian") || raceLabel.includes("alaska native")) {
    return "loinc:LA10608-0";
  } else if (raceLabel.includes("black") || raceLabel.includes("african american")) {
    return "loinc:LA10610-6";
  } else if (raceLabel.includes("asian")) {
    return "loinc:LA6156-9";
  } else if (raceLabel.includes("native hawaiian") || raceLabel.includes("pacific islander")) {
    return "loinc:LA10611-4";
  } else {
    return "loinc:LA4489-6"
  }
}

function onlyNonNull(item) {
  return item;
}

function checkDonorId(id) {
  return checkIfValidUrl(id, 'Donor ID');
}

function checkSampleId(id) {
  return checkIfValidUrl(id, 'Sample ID');
}

function checkTissueBlockId(id) {
  return checkIfValidUrl(id, 'Tissue Block ID');
}

function checkTissueSectionId(id) {
  return checkIfValidUrl(id, 'Tissue Section ID');
}

function checkDatasetId(id) {
  return checkIfValidUrl(id, 'Dataset ID');
}

function checkExtractionSiteId(id) {
  return checkIfValidUrl(id, 'Extraction Site ID');
}

function checkPlacementId(id) {
  return checkIfValidUrl(id, 'Placement ID');
}