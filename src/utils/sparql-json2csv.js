#!/usr/bin/env node
import { createReadStream, createWriteStream } from 'fs';
import Papa from 'papaparse';
import { SparqlJsonParser } from 'sparqljson-parse';

export function resultsStreamToCsvStream(jsonStream, csvStream) {
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

export function sparqlJsonToCsv(inputJson, outputCsv) {
  return resultsStreamToCsvStream(createReadStream(inputJson), createWriteStream(outputCsv));
}
