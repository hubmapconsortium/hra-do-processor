import { resolve } from 'path';
import { listDeployed } from '../list.js';
import { readMetadata, readNormalizedMetadata } from '../normalization/utils.js';
import { getDigitalObjectInformation } from '../utils/digital-object.js';
import { writeDoiFiles } from './utils/generate-doi-files.js';
import { writeIndexHtml } from './utils/generate-index-html.js';
import { writeReadmeMd } from './utils/generate-readme-md.js';

export function miscDoFiles(context) {
  deployDoiXml(context);
  const normalizedMetadata = readNormalizedMetadata(context);
  writeReadmeMd(context, normalizedMetadata);
  writeIndexHtml(context, normalizedMetadata);
}

export function miscFiles(context) {
  for (const dataset of listDeployed(context).filter((doName) => !doName.endsWith('/latest'))) {
    const doPath = resolve(context.doHome, dataset);
    const selectedDigitalObject = getDigitalObjectInformation(doPath, context.purlIri);
    miscDoFiles({ ...context, selectedDigitalObject });
  }
}

export function deployDoiXml(context) {
  const metadata = readMetadata(context);
  writeDoiFiles(context, metadata);
}
