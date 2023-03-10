import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import fetch from 'node-fetch';
import { resolve } from 'path';
import sh from 'shelljs';
import { validateNormalized } from '../utils/validation.js';
import { readMetadata, writeNormalized } from './utils.js';

const ASCTB_API = 'https://mmpyikxkcp.us-east-2.awsapprunner.com/';

export async function normalizeAsctb(context) {
  const obj = context.selectedDigitalObject;
  const metadata = readMetadata(obj);

  const dataUrl = metadata.datatable;
  const requestUrl =
    ASCTB_API +
    'v2/csv?' +
    new URLSearchParams({
      csvUrl: dataUrl,
      cached: true,
    });
  const data = await fetch(requestUrl).then((r) => r.json());
  const normalizedData = normalizeAsctbApiResponse(data.data);

  writeNormalized(obj, metadata, normalizedData);
  validateNormalized(context);

  // If warnings are found in the response, save for reference.
  const warningsFile = resolve(obj.path, 'normalized/warnings.yaml');
  sh.rm('-f', warningsFile); // Clear previous warnings file
  if (!context.skipValidation && data.warnings?.length > 0) {
    writeFileSync(warningsFile, dump({ warnings: data.warnings }));
    console.log(
      chalk.yellow('Warnings were reported by the ASCTB-API.'),
      'This may indicate further errors that need resolved. Please review the warnings at',
      warningsFile
    );
  }
}

function normalizeAsctbApiResponse(data) {
  // TODO: convert individual asctb rows to the format specified by LinkML
  return data.map((d) => {
    return d;
  });
}
