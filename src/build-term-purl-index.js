#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import Papa from 'papaparse';

const REQUIRED_COLUMNS = ['iri', 'purl'];
const USAGE = 'Usage: node src/build-term-purl-index.js <input.csv> [output.json]';

function usage() {
  console.error(USAGE);
}

function getRequiredValue(row, key) {
  if (!row || typeof row !== 'object') {
    return '';
  }

  const value = row[key];
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeHeader(header) {
  return typeof header === 'string' ? header.trim().toLowerCase() : '';
}

function hasRequiredColumns(fields) {
  return Array.isArray(fields) && REQUIRED_COLUMNS.every((column) => fields.includes(column));
}

/**
 * Build a compact index structure from parsed CSV rows containing iri and purl values.
 *
 * @param {Array<Record<string, unknown>>} rows Parsed CSV rows.
 * @returns {{terms: string[], purls: string[], term_to_purls: number[][], purl_to_terms: number[][]}}
 */
export function buildTermPurlIndex(rows) {
  if (!Array.isArray(rows)) {
    throw new TypeError('Expected rows to be an array of parsed CSV records');
  }

  const terms = [];
  const purls = [];
  const termToPurlSets = [];
  const purlToTermSets = [];

  const termIndexByValue = new Map();
  const purlIndexByValue = new Map();

  for (const row of rows) {
    const term = getRequiredValue(row, 'iri');
    const purl = getRequiredValue(row, 'purl');

    // Ignore incomplete rows so malformed lines do not break index generation.
    if (!term || !purl) {
      continue;
    }

    let termIndex = termIndexByValue.get(term);
    if (termIndex === undefined) {
      termIndex = terms.length;
      termIndexByValue.set(term, termIndex);
      terms.push(term);
      termToPurlSets.push(new Set());
    }

    let purlIndex = purlIndexByValue.get(purl);
    if (purlIndex === undefined) {
      purlIndex = purls.length;
      purlIndexByValue.set(purl, purlIndex);
      purls.push(purl);
      purlToTermSets.push(new Set());
    }

    termToPurlSets[termIndex].add(purlIndex);
    purlToTermSets[purlIndex].add(termIndex);
  }

  return {
    terms,
    purls,
    term_to_purls: termToPurlSets.map((purlSet) => Array.from(purlSet)),
    purl_to_terms: purlToTermSets.map((termSet) => Array.from(termSet)),
  };
}

/**
 * Parse CSV text containing iri and purl columns and return the compact index.
 *
 * @param {string} csv CSV text.
 * @returns {{terms: string[], purls: string[], term_to_purls: number[][], purl_to_terms: number[][]}}
 */
export function parseTermPurlCsv(csv) {
  if (typeof csv !== 'string') {
    throw new TypeError('Expected csv to be a string');
  }

  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  });

  if (parsed.errors.length > 0) {
    const messages = parsed.errors.map((err) => err.message).join('; ');
    throw new Error(`Failed to parse CSV: ${messages}`);
  }

  if (!hasRequiredColumns(parsed.meta.fields)) {
    throw new Error(`Input CSV must include header columns: ${REQUIRED_COLUMNS.join(', ')}`);
  }

  return buildTermPurlIndex(parsed.data);
}

/**
 * Read a CSV file from disk and build the compact term/purl index.
 *
 * @param {string} inputPath Path to the input CSV file.
 * @returns {{terms: string[], purls: string[], term_to_purls: number[][], purl_to_terms: number[][]}}
 */
export function buildTermPurlIndexFromCsvFile(inputPath) {
  if (!inputPath) {
    throw new TypeError('Expected inputPath to be a non-empty string');
  }

  let csv;
  try {
    csv = readFileSync(inputPath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read input CSV ${inputPath}: ${error.message}`, { cause: error });
  }

  return parseTermPurlCsv(csv);
}

/**
 * Serialize an index object as minified JSON with a trailing newline.
 *
 * @param {{terms: string[], purls: string[], term_to_purls: number[][], purl_to_terms: number[][]}} index
 * @returns {string}
 */
export function serializeTermPurlIndex(index) {
  return `${JSON.stringify(index)}\n`;
}

/**
 * Run the command-line interface.
 *
 * @param {string[]} argv Process argument vector.
 * @returns {number} Exit code.
 */
export function runCli(argv = process.argv) {
  const [, , inputPath, outputPath] = argv;

  if (!inputPath) {
    usage();
    return 1;
  }

  let outputObject;
  try {
    outputObject = buildTermPurlIndexFromCsvFile(inputPath);
  } catch (error) {
    console.error(error.message);
    return 1;
  }

  const outputJson = serializeTermPurlIndex(outputObject);

  try {
    if (outputPath) {
      writeFileSync(outputPath, outputJson, 'utf8');
    } else {
      process.stdout.write(outputJson);
    }
  } catch (error) {
    console.error(`Failed to write output: ${error.message}`);
    return 1;
  }

  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runCli();
}
