#!/usr/bin/env node
import { createReadStream, createWriteStream } from 'fs';
import Papa from 'papaparse';
import { SparqlJsonParser } from 'sparqljson-parse';

const IN_JSON = process.argv[2];
const OUT_CSV = process.argv[3];

function resultsStreamToCsvStream(jsonStream, csvStream) {
  const parser = new SparqlJsonParser();
  const stream = parser.parseJsonResultsStream(jsonStream);

  return new Promise((resolve, _reject) => {
    let results = [];
    let header;
    stream.on('variables', (variables) => {
      header = variables.map((v) => v.value);
      csvStream.write(Papa.unparse([header]) + '\n');
    });
    stream.on('data', (bindings) => {
      const result = Object.keys(bindings).reduce((acc, key) => ((acc[key] = bindings[key]?.value), acc), {});
      results.push(result);
      if (header) {
        csvStream.write(Papa.unparse(results, { header: false, columns: header }) + '\n');
        results = [];
      }
    });
    stream.on('end', () => {
      if (header && results.length > 0) {
        csvStream.write(Papa.unparse(results, { header: false, columns: header }) + '\n');
      }
      csvStream.close();
      resolve();
    });
  });
}

const inStream = IN_JSON === '-' ? process.stdin : createReadStream(IN_JSON);
const outStream = OUT_CSV === '-' ? process.stdout : createWriteStream(OUT_CSV);

await resultsStreamToCsvStream(inStream, outStream);