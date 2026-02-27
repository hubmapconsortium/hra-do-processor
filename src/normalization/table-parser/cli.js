import { readFileSync, writeFileSync } from 'fs';
import { WPP_TABLE_PARSER_CONFIG } from '../normalize-wpp.js';
import { parseTable } from './parser.js';

const INPUT_CSV = process.argv[2];
const OUTPUT_JSON = process.argv[3];

const csvString = readFileSync(INPUT_CSV, 'utf8');
const data = parseTable(csvString, WPP_TABLE_PARSER_CONFIG);

writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2));
