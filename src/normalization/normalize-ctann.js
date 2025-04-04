import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import Papa from 'papaparse';
import { resolve } from 'path';
import sh from 'shelljs';
import { info, more, warning } from '../utils/logging.js';
import { normalizeMetadata, readMetadata, writeNormalizedData, writeNormalizedMetadata } from './utils.js';
import { makeCtAnnData } from './ctann-utils/api.functions.js';
import { formatCustomDate } from './ctann-utils/utils.js';

export function normalizeCtAnnMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalizeCtAnnData(context) {
  const rawData = await getRawData(context);
  const normalizedData = normalizeData(context, rawData);
  writeNormalizedData(context, normalizedData);
}

async function getRawData(context) {
  const { path } = context.selectedDigitalObject;

  const metadata = readMetadata(context);
  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;
  let csvData;
  if (dataUrl.startsWith('http')) {
    csvData = await fetch(dataUrl).then((r) => r.text());
  } else {
    csvData = readFileSync(resolve(path, 'raw', dataUrl), 'utf8').toString();
  }
  csvData = csvData.replace(/\uFFFD/g, ' '); // Remove bad unicode character
  const csvRows = Papa.parse(csvData).data;
  const data = makeCtAnnData(csvRows);
  info(`Reading data: ${dataUrl}`);

  // If warnings are found in the response, save for reference.
  const warningsFile = resolve(path, 'normalized/warnings.yaml');
  sh.rm('-f', warningsFile); // Clear previous warnings file
  if (!context.skipValidation && data.warnings?.length > 0) {
    writeFileSync(warningsFile, dump(data.warnings));
    warning('CSV parser reports some warnings.');
    more(`Please review the warnings at ${warningsFile}`);
  }

  return data;
}

function normalizeData(context, obj) {
  const { metadata, data } = obj;
  return {
    id: `${getPurl(context)}#primary`,
    label: metadata.title,
    type_of: ['ccf:CtAnnMappingSet'],
    mapping_set_id: metadata.data_doi,
    mapping_set_title: metadata.title,
    mapping_set_version: metadata.version,
    mapping_date: formatCustomDate(metadata.date),
    creator_label: metadata.author_names,
    creator_id: metadata.author_orcids,
    license: "https://creativecommons.org/licenses/by/4.0/",
    extension_definitions: [{
      id: `${getPurl(context)}#extension1`,
      label: "Organ level extension column",
      type_of: ['ccf:CtAnnExtensionDefinition'],
      slot_name: "ext_organ_level",
      property: "http://purl.org/ccf/organ_level",
      type_hint: "xsd:string",
    }, {
      id: `${getPurl(context)}#extension2`,
      label: "Organ ID extension column",
      type_of: ['ccf:CtAnnExtensionDefinition'],
      slot_name: "ext_organ_id",
      property: "http://purl.org/ccf/organ_id",
      type_hint: "xsd:anyURI",
    }],
    mappings: getMappings(context, data)
  }
}

function getMappings(context, data) {
  const mappings = [];
  for (const row of data) {
    mappings.push({
      id: `${getPurl(context)}#R${row.recordNumber}`,
      label: `Record ${row.recordNumber}`,
      type_of: ['ccf:CtAnnMapping'],
      subject_id: row.annotation_id,
      subject_label: row.annotation_label,
      predicate_id: row.match_category,
      object_id: row.cl_id,
      object_label: row.cl_label,
      ext_organ_level: row.organ_level,
      ext_organ_id: row.organ_id,
      mapping_justification: 'semapv:ManualMappingCuration',
    });
  }
  return mappings;
}

function getPurl(context) {
  const { type, name, version } = context.selectedDigitalObject;
  return `${context.purlIri}${type}/${name}/${version}`;
}