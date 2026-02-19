import { readFileSync, writeFileSync } from 'fs';
import { parseTable } from './parser.js';

const INPUT_CSV = process.argv[2];
const OUTPUT_JSON = process.argv[3];

const csvString = readFileSync(INPUT_CSV, 'utf8');
const data = parseTable(csvString, {
  headerFirstColumnName: 'Function/1',
  metadataTitleRow: 0,
  defaultObjectProp: 'name',
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
    'doi', 'external_reviewer_names_list', 'external_reviewer_orcids_list', 'general_publications_list'
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
});

writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2));
