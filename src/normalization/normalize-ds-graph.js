import { readFileSync } from 'fs';
import { resolve } from 'path';
import { info } from '../utils/logging.js';
import { hash } from '../utils/hash.js';
import { checkIfValidIri, checkIfValidUrl } from '../utils/validation.js';
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
  try {
    return {
      donor: removeDuplicate(normalizeDonorData(data), ['id']),
      sample: removeDuplicate(normalizeSampleData(context, data), ['id']),
      dataset: removeDuplicate(normalizeDatasetData(context, data), ['id']),
      spatial_entity: removeDuplicate(normalizeExtractionSiteData(context, data), ['id']),
      cell_summary: removeDuplicate(normalizeCellSummaryData(context, data), ['id']),
      collision: removeDuplicate(normalizeCollisionData(context, data), ['id']),
      corridor: removeDuplicate(normalizeCorridorData(context, data), ['id'])
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------------
// NORMALIZING DONOR DATA
// ---------------------------------------------------------------------------------

function normalizeDonorData(data) {
  try {
    return data['@graph'].map(createDonorObject).filter(onlyNonNull);
  } catch (error) {
    throw new Error("Problem in normalizing donor data: ", { cause: error });
  }
}

function createDonorObject(donor) {
  if (!checkDonorId(donor['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', donor['@id'])
    .append('label', getDonorLabel(donor))
    .append('type_of', ['Donor'])
    .append('pref_label', donor.label)
    .append('description', donor.description)
    .append('link', donor.link)
    .append('age', ensureNumber(donor.age))
    .append('sex', donor.sex)
    .append('sex_id', getSexId(donor.sex))
    .append('bmi', ensureNumber(donor.bmi))
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

// ---------------------------------------------------------------------------------
// NORMALIZING SAMPLE DATA
// ---------------------------------------------------------------------------------

function normalizeSampleData(context, data) {
  try {
    const donors = data['@graph'];
    return donors.map((donor) => {
      return donor['samples']
        .map((block) => createTissueBlockObject(context, donor, block))
        .filter(onlyNonNull)
    }).flat();
  } catch (error) {
    throw new Error("Problem in normalizing sample data", { cause: error });
  }
}

function createTissueBlockObject(context, donor, block) {
  if (!checkTissueBlockId(block['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', block['@id'])
    .append('label', getSampleLabel(block))
    .append('type_of', ['TissueBlock'])
    .append('pref_label', block.label)
    .append('description', block.description)
    .append('rui_location', block.rui_location?.['@id'])
    .append('link', block.link)
    .append('sections', block.sections
      ?.map((section) => createTissueSectionObject(block, section))
      .filter(onlyNonNull))
    .append('datasets', block.datasets
      ?.map((dataset) => dataset['@id'])
      .filter(checkDatasetId))
    .append('section_count', block.section_count)
    .append('section_size', block.section_size)
    .append('section_size_unit', block.section_size_unit)
    .build();
}

function createTissueSectionObject(block, section) {
  if (!checkTissueSectionId(section['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', section['@id'])
    .append('label', getSampleLabel(section))
    .append('type_of', ['TissueSection'])
    .append('pref_label', section.label)
    .append('description', section.description)
    .append('link', section.link)
    .append('section_number', section.section_number)
    .append('datasets', section.datasets
      ?.map((dataset) => dataset['@id'])
      .filter(checkDatasetId))
    .build();
}

// ---------------------------------------------------------------------------------
// NORMALIZING DATASET DATA
// ---------------------------------------------------------------------------------

function normalizeDatasetData(context, data) {
  try {
    const donors = data['@graph']
    const sampleBlockDatasets = donors.map((donor) => {
      return donor['samples'].map((block) => {
        return block['datasets']?.map((dataset) => createDatasetObject(context, dataset))
      }).flat();
    }).flat();
    const sampleSectionDatasets = donors.map((donor) => {
      return donor['samples'].map((block) => {
        return block['sections']?.map((section) => {
          return section['datasets']?.map((dataset) => createDatasetObject(context, dataset))
        }).flat();
      }).flat();
    }).flat();
    return [...sampleBlockDatasets, ...sampleSectionDatasets].filter(onlyNonNull);
  } catch (error) {
    throw new Error("Problem in normalizing dataset data: ", { cause: error });
  }
}

function createDatasetObject(context, dataset) {
  if (!checkDatasetId(dataset['@id'])) {
    return null;
  }
  const normalizedDataset = new ObjectBuilder()
    .append('id', dataset['@id'])
    .append('label', getDatasetLabel(dataset))
    .append('type_of', ['Dataset'])
    .append('pref_label', dataset.label)
    .append('description', dataset.description)
    .append('link', dataset.link)
    .append('technology', dataset.technology || 'OTHER')
    .append('thumbnail', dataset.thumbnail || 'assets/icons/ico-unknown.svg')
    .append('summaries', dataset.summaries?.map((summary, index) =>
      generateCellSummaryId(context, dataset, summary, index)) || [])
    .build();

    if ('cell_count' in dataset) {
      normalizedDataset['cell_count'] = ensureNumber(dataset['cell_count']);
    }
    if ('gene_count' in dataset) {
      normalizedDataset['gene_count'] = ensureNumber(dataset['gene_count']);
    }
    if ('organ_id' in dataset) {
      normalizedDataset['organ_id'] = checkIfValidIri(dataset['organ_id']);
    }
    
    return normalizedDataset;
}

// ---------------------------------------------------------------------------------
// NORMALIZING EXTRACTION SITE DATA
// ---------------------------------------------------------------------------------

function normalizeExtractionSiteData(context, data) {
  try {
    const donors = data['@graph'];
    return donors.map((donor) => {
      return donor['samples'].map((block) =>
        createExtractionSiteObject(context, block)
      ).filter(onlyNonNull);
    }).flat();
  } catch (error) {
    throw new Error("Problem in normalizing extraction site data: ", { cause: error });
  }  
}

function createExtractionSiteObject(context, block) {
  const spatialEntity = block.rui_location;
  if (!spatialEntity || !checkExtractionSiteId(spatialEntity['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', spatialEntity['@id'])
    .append('label', getSpatialEntityLabel(block))
    .append('pref_label', spatialEntity.label)
    .append('type_of', ['SpatialEntity'])
    .append('collides_with', spatialEntity.ccf_annotations)
    .append('create_date', normalizeDate(spatialEntity.creation_date))
    .append('creator_name', spatialEntity.creator)
    .append('x_dimension', spatialEntity.x_dimension)
    .append('y_dimension', spatialEntity.y_dimension)
    .append('z_dimension', spatialEntity.z_dimension)
    .append('dimension_unit', spatialEntity.dimension_units)
    .append('slice_count', spatialEntity.slice_count)
    .append('slice_thickness', spatialEntity.slice_thickness)
    .append('placement', createPlacementObject(block, spatialEntity, spatialEntity.placement))
    .append('all_collisions', spatialEntity.all_collisions?.map((collision, index) =>
      generateCollisionSummaryId(context, spatialEntity, collision, index)).filter(onlyNonNull) || [])
    .append('corridor', getCorridorId(context, spatialEntity, spatialEntity.corridor))
    .append('summaries', spatialEntity.summaries?.map((summary, index) =>
      generateCellSummaryId(context, spatialEntity, summary, index)).filter(onlyNonNull) || [])
    .build();
}

function createPlacementObject(block, spatialEntity, placement) {
  if (!checkPlacementId(placement['@id'])) {
    return null;
  }
  return new ObjectBuilder()
    .append('id', placement['@id'])
    .append('label', getPlacementLabel(block))
    .append('type_of', ['SpatialPlacement'])
    .append('pref_label', placement.label)
    .append('placement_date', normalizeDate(placement.placement_date))
    .append('source', spatialEntity['@id'])
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

// ---------------------------------------------------------------------------------
// NORMALIZING CELL SUMMARY DATA
// ---------------------------------------------------------------------------------

function normalizeCellSummaryData(context, data) {
  try {
    const donors = data['@graph'];
    const sampleBlockCellSummaries = donors.map((donor) => {
      return donor['samples'].map((block) => {
        return block['datasets']?.map((dataset) => {
          return dataset['summaries']?.map((summary, index) => 
            createCellSummaryObject(context, dataset, summary, index))
        }).flat();
      }).flat();
    }).flat();
    const sampleSectionCellSummaries = donors.map((donor) => {
      return donor['samples'].map((block) => {
        return block['sections']?.map((section) => {
          return section['datasets']?.map((dataset) => {
            return dataset['summaries']?.map((summary, index) => 
              createCellSummaryObject(context, dataset, summary, index))
          }).flat();
        }).flat();
      }).flat();
    }).flat();
    return [...sampleBlockCellSummaries, ...sampleSectionCellSummaries].filter(onlyNonNull);
  } catch (error) {
    throw new Error("Problem in normalizing cell summary data: ", { cause: error });
  }
}

function createCellSummaryObject(context, dataset, summary, index) {
  return new ObjectBuilder()
    .append('id', generateCellSummaryId(context, dataset, summary, index))
    .append('label', getCellSummaryLabel(dataset, summary, index))
    .append('type_of', ['CellSummary'])
    .append('annotation_method', summary.annotation_method)
    .append('modality', summary.modality)
    .append('donor_sex', summary.sex)
    .append('summary_rows', summary['summary'].map((summaryRow, itemIndex) =>
      createCellSummaryRowObject(context, dataset, summary, summaryRow, itemIndex)))
    .build();
}

function createCellSummaryRowObject(context, dataset, summary, summaryRow, index) {
  return new ObjectBuilder()
    .append('id', generateSummaryRowId(context, dataset, summary, summaryRow, index))
    .append('label', getSummaryRowLabel(dataset, summary, summaryRow, index))
    .append('type_of', ['CellSummaryRow'])
    .append('cell_id', summaryRow.cell_id)
    .append('cell_label', summaryRow.cell_label)
    .append('gene_expressions', summaryRow['gene_expr']?.map((expr, itemIndex) =>
      createGeneExpressionObject(context, dataset, summary, summaryRow, expr, itemIndex)) || [])
    .append('count', summaryRow.count)
    .append('percentage', summaryRow.percentage)
    .build();
}

function createGeneExpressionObject(context, dataset, summary, summaryRow, expr, index) {
  return new ObjectBuilder()
    .append('id', generateGeneExpressionId(context, dataset, summary, summaryRow, expr, index))
    .append('label', getGeneExpressionLabel(dataset, summary, summaryRow, expr, index))
    .append('type_of', ['GeneExpression'])
    .append('gene_id', expr.gene_id)
    .append('gene_label', expr.gene_label)
    .append('ensembl_id', expr.ensembl_id)
    .append('mean_gene_expression_value', expr.mean_gene_expr_value)
    .build();
}

// ---------------------------------------------------------------------------------
// NORMALIZING COLLISION DATA
// ---------------------------------------------------------------------------------

function normalizeCollisionData(context, data) {
  try {
    const donors = data['@graph'];
    return donors.map((donor) => {
      return donor.samples.map((block) => {
      if (!block.rui_location) {
        return [];
      }
      const spatialEntity = block.rui_location;
      const collisionSummaries = spatialEntity.all_collisions || [];
      return collisionSummaries
        .map((collisionSummary, index) => createCollisionObject(context, spatialEntity, collisionSummary, index))
        .filter(onlyNonNull);
      }).flat();
    }).flat();
  } catch (error) {
    throw new Error("Problem in normalizing collision data: ", { cause: error });
  }
}

function createCollisionObject(context, spatialEntity, collisionSummary, index) {
  return new ObjectBuilder()
    .append('id', generateCollisionSummaryId(context, spatialEntity, collisionSummary, index))
    .append('label', getCollisionSummaryLabel(spatialEntity, collisionSummary, index)) 
    .append('type_of', ['CollisionSummary'])
    .append('collision_method', collisionSummary.collision_method)
    .append('collisions', collisionSummary['collisions']?.map((collisionItem, itemIndex) =>
      createCollisionItemObject(context, spatialEntity, collisionSummary, collisionItem, itemIndex)) || [])
    .build();
}

function createCollisionItemObject(context, spatialEntity, collisionSummary, collisionItem, index) {
  return new ObjectBuilder()
    .append('id', generateCollisionItemId(context, spatialEntity, collisionSummary, collisionItem, index))
    .append('label', getCollisionItemLabel(spatialEntity, collisionSummary, collisionItem, index))
    .append('type_of', ['CollisionItem'])
    .append('spatial_entity_reference', collisionItem.as_3d_id)
    .append('volume', collisionItem.as_volume)
    .append('percentage', collisionItem.percentage)
    .build();
}

// ---------------------------------------------------------------------------------
// NORMALIZING CORRIDOR DATA
// ---------------------------------------------------------------------------------

function normalizeCorridorData(context, data) {
  try {
    const donors = data['@graph'];
    return donors.map((donor) => {
      return donor['samples'].map((block) => {
        if ('rui_location' in block) {
          const corridor = block.rui_location.corridor;
          return corridor ? createCorridorObject(context, spatialEntity, corridor) : null;
        }
        return null;
      }).filter(onlyNonNull);
    }).flat();
  } catch (error) {
    throw new Error("Problem in normalizing corridor data: ", { cause: error });
  }
}

function createCorridorObject(context, spatialEntity, corridor) {
  return new ObjectBuilder()
    .append('id', generateCorridorId(context, spatialEntity, corridor))
    .append('label', getCorridorLabel(spatialEntity, corridor))
    .append('type_of', ['Corridor'])
    .append('file_format', corridor.file_format)
    .append('file', corridor.file)
    .build();
}

// ---------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------------

function normalizeDate(originalDate) {
  const date = new Date(originalDate);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

function getCorridorId(context, parent, corridor) {
  return corridor ? generateCorridorId(context, parent, corridor) : null;
}

function generateCorridorId(context, parent, corridor) {
  const { iri, version } = context.selectedDigitalObject;
  const hashCode = getCorridorHash(parent, corridor);
  return `${iri}/${version}#${hashCode}`;
}

function generateCollisionSummaryId(context, parent, collisionSummary, index) {
  const { iri, version } = context.selectedDigitalObject;
  const hashCode = getCollisionHash(parent, collisionSummary, index);
  return `${iri}/${version}#${hashCode}`;
}

function generateCollisionItemId(context, parent, collisionSummary, collisionItem, index) {
  const { iri, version } = context.selectedDigitalObject;
  const hashCode = getCollisionItemHash(parent, collisionSummary, collisionItem, index);
  return `${iri}/${version}#${hashCode}`;
}

function generateCellSummaryId(context, parent, summary, index) {
  const { iri, version } = context.selectedDigitalObject;
  const hashCode = getCellSummaryHash(parent, summary, index);
  return `${iri}/${version}#${hashCode}`;
}

function generateSummaryRowId(context, dataset, summary, summaryRow, index) {
  const { iri, version } = context.selectedDigitalObject;
  const hashCode = getSummaryRowHash(dataset, summary, summaryRow, index);
  return `${iri}/${version}#${hashCode}`;
}

function generateGeneExpressionId(context, dataset, summary, summaryRow, expr, index) {
  const { iri, version } = context.selectedDigitalObject;
  const hashCode = getGeneExpressionHash(dataset, summary, summaryRow, expr, index);
  return `${iri}/${version}#${hashCode}`;
}

function getCellSummaryHash(parent, summary, index, length=0) {
  const { annotation_method, modality } = summary;
  const primaryKey = `${parent['@id']}-${annotation_method}-${modality}-${index}`;
  return getHashCode(primaryKey, length);
}

function getSummaryRowHash(dataset, summary, summaryRow, index, length=0) {
  const { annotation_method, modality } = summary;
  const { cell_label } = summaryRow;
  const primaryKey = `${dataset['@id']}-${annotation_method}-${modality}-${cell_label}-${index}`;
  return getHashCode(primaryKey, length);
}

function getGeneExpressionHash(dataset, summary, summaryRow, expr, index, length=0) {
  const { annotation_method, modality } = summary;
  const { cell_label } = summaryRow;
  const { gene_label } = expr;
  const primaryKey = `${dataset['@id']}-${annotation_method}-${modality}-${cell_label}-${gene_label}-${index}`;
  return getHashCode(primaryKey, length);
}

function getCollisionHash(parent, collisionSummary, index, length=0) {
  const { collision_method } = collisionSummary;
  const primaryKey = `${parent['@id']}-${collision_method}-${index}`;
  return getHashCode(primaryKey, length);
}

function getCollisionItemHash(parent, collisionSummary, collisionItem, index, length=0) {
  const { collision_method } = collisionSummary;
  const { as_3d_id } = collisionItem;
  const primaryKey = `${parent['@id']}-${collision_method}-${as_3d_id}-${index}`;
  return getHashCode(primaryKey, length);
}

function getCorridorHash(parent, corridor, length=0) {
  const { file } = corridor;
  const primaryKey = `${parent['@id']}-${file}`;
  return getHashCode(primaryKey, length);
}

function getHashCode(str, length=0) {
  const hashCode = hash(str).toString();
  return (length > 1) ? hashCode.substring(0, length) : hashCode;
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

function getCellSummaryLabel(dataset, summary, index) {
  const { technology } = dataset;
  const { annotation_method } = summary;
  const hashCode = getCellSummaryHash(dataset, summary, index, 5);
  return `Cell summary of the ${technology} dataset calculated using the ${annotation_method} method (#${hashCode})`;
}

function getSummaryRowLabel(dataset, summary, summaryRow, index) {
  const { cell_label } = summaryRow;
  const hashCode = getSummaryRowHash(dataset, summary, summaryRow, index, 5);
  return `Cell summary details for ${cell_label} (#${hashCode})`;
}

function getGeneExpressionLabel(dataset, summary, summaryRow, expr, index) {
  const { cell_label } = summaryRow;
  const { gene_label } = expr;
  const hashCode = getGeneExpressionHash(dataset, summary, summaryRow, expr, index, 5);
  return `Gene expression for ${gene_label} in ${cell_label} (#${hashCode})`;
}

function getCollisionSummaryLabel(parent, collisionSummary, index) {
  const { collision_method } = collisionSummary;
  const hashCode = getCollisionHash(parent, collisionSummary, index, 5);
  return `Collision summary using ${collision_method} method (#${hashCode})`;
}

function getCollisionItemLabel(parent, collisionSummary, collisionItem, index) {
  const { collision_method } = collisionSummary;
  const { as_label } = collisionItem;
  const hashCode = getCollisionItemHash(parent, collisionSummary, collisionItem, index, 5);
  return `Collision with ${as_label} using the ${collision_method} method (#${hashCode})`;
}

function getCorridorLabel(parent, collision) {
  const hashCode = getCorridorHash(parent, collision, 5);
  return `Corridor of tissue block (#${hashCode})`;
}

function getSexId(sex) {
  if (!sex) {
    return null;
  }
  switch (sex.toLowerCase()) {
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

function ensureNumber(value) {
  if (typeof value === 'string') {
    return Number(value);
  } else {
    return value ?? null;
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
