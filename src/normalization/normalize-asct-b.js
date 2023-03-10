import fetch from 'node-fetch';
import { resolve } from 'path';
import { readMetadata, validateNormalized, writeNormalized } from './utils.js';

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

  writeNormalized(obj, metadata, data.data);
  console.log('normalized asct-b table written to', obj.doString + '/normalized/normalized.yaml');

  if (!context.skipValidation) {
    const isValid = validateNormalized(obj, context.processorHome);
    if (!isValid) {
      console.log(
        'normalized asct-b table was invalid! Check the errors at',
        resolve(obj.path, 'normalized/errors.yaml')
      );
      return;
    }
  }
}
