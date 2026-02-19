import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { info, more, warning } from '../utils/logging.js';
import { generateIdWhenEmpty } from './normalize-asct-b.js';
import { parseTable } from './table-parser/parser.js';
import { normalizeMetadata, readMetadata, writeNormalizedData, writeNormalizedMetadata } from './utils.js';

export function normalizeWppMetadata(context) {
  const rawMetadata = readMetadata(context);
  const normalizedMetadata = normalizeMetadata(context, rawMetadata);
  writeNormalizedMetadata(context, normalizedMetadata);
}

export async function normalizeWppData(context) {
  const rawData = await getRawData(context);
  const normalizedData = normalizeData(context, rawData.data);
  writeNormalizedData(context, normalizedData);
}

export async function getRawData(context) {
  const { iri, path, version } = context.selectedDigitalObject;

  const metadata = readMetadata(context);
  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;
  let csvString;
  if (dataUrl.startsWith('http')) {
    csvString = await fetch(dataUrl).then((r) => r.text());
  } else {
    csvString = readFileSync(resolve(path, 'raw', dataUrl), 'utf8');
  }
  csvString = csvString.replace(/\uFFFD/g, ' '); // Remove bad unicode character
  const data = parseTable(csvString, { purl: `${iri}/${version}`, recordSource: iri, ...WPP_TABLE_PARSER_CONFIG });

  info(`Reading data: ${dataUrl}`);

  // If warnings are found in the response, save for reference.
  const warningsFile = resolve(path, 'normalized/warnings.yaml');
  sh.rm('-f', warningsFile); // Clear previous warnings file
  if (!context.skipValidation && data.warnings?.length > 0) {
    writeFileSync(warningsFile, dump(data.warnings));
    warning('Warnings were reported by the parser. This may indicate further errors that need resolved.');
    more(`Please review the warnings at ${warningsFile}`);
  }

  return data;
}

const WPP_TABLE_PARSER_CONFIG = {
  headerFirstColumnName: 'Function/1',
  metadataTitleRow: 0,
  defaultObjectProp: 'pref_label',
  ignoreUnmappedMetadata: true,
  metadataKeyMapping: {
    'author name(s):': 'author_names_list',
    'author orcid(s):': 'author_orcids_list',
    'reviewer name(s):': 'reviewer_names_list',
    'reviewer orcid(s):': 'reviewer_orcids_list',
    'external reviewer name(s):': 'external_reviewer_names_list',
    'external reviewer orcid(s):': 'external_reviewer_orcids_list',
    'general publication(s):': 'general_publications_list',
    'version number:': 'version',
    'data doi:': 'doi',
    'date:': 'date',
  },
  optionalMetadata: [
    'doi',
    'external_reviewer_names_list',
    'external_reviewer_orcids_list',
    'general_publications_list',
  ],
  metadataArrayFields: [
    'author_names_list',
    'author_orcids_list',
    'review_names_list',
    'review_orcids_list',
    'general_publications_list',
  ],
  metadataValueArrayDelimeter: ';',
  dataPropertyMapping: {
    id: 'source_concept',
    behavior: 'behavior',
    'behavior x': 'behavior_x',
    'behavior y': 'behavior_y',
    'behavior z': 'behavior_z',
    clinicalmeasure: 'clinical_measure_list',
    effect: 'effect',
    effector: 'effector',
    effectorlocation: 'effector_location',
    effectorscale: 'effector_scale',
    'effectparameters (quantitative values)': 'effect_parameters_quantative',
    effectscale: 'effect_scale',
    function: 'function_list',
    interaction: 'interaction',
    process: 'process',
    'process triple': 'process_triple',
    quantitativenotes: 'quantitative_notes',
    ref: 'reference_list',
    regulation: 'regulation',
    signal: 'signal',
    signalscale: 'signal_scale',
    state: 'state',
    timescale: 'time_scale',
    'x target': 'x_target',
  },
};

function normalizeData(context, data) {
  const { excludeBadValues } = context;
  if (excludeBadValues) {
    warning(
      `Option '--exclude-bad-values' is used to exclude invalid values. The resulting data may be lessen than the raw data.`
    );
  }

  for (const record of data) {
    for (const [_key, value] of Object.entries(record)) {
      if (Array.isArray(value)) {
        value.forEach((entry) => {
          normalizeSourceData(entry);
        });
      } else if (typeof value === 'object') {
        normalizeSourceData(value);
      }
    }
  }

  return {
    wpp_records: data,
    ontology_terms: [],
  };
}

function normalizeSourceData(obj) {
  const id = obj.source_concept?.replace('ISBN: ', 'ISBN:').replace('ISBN ', 'ISBN:').replace('LOINC ', 'LOINC:') ?? '';
  if (obj.pref_label) {
    obj.source_concept = generateIdWhenEmpty(id, obj.pref_label ?? '');
  }

  return obj;
}
