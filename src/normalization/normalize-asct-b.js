import fetch from 'node-fetch';
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

  writeNormalized(obj, metadata, data.data);
  validateNormalized(context);
}
