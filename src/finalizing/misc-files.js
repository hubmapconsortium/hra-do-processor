import { resolve } from 'path';
import { listDeployed } from '../list.js';
import { readMetadata, readNormalizedMetadata } from '../normalization/utils.js';
import { getDigitalObjectInformation } from '../utils/digital-object.js';
import { writeDoiXml } from './utils/generate-doi-xml.js';
import { writeIndexHtml } from './utils/generate-index-html.js';
import { writeReadmeMd } from './utils/generate-readme-md.js';

export function miscDoFiles(context) {
  const metadata = readMetadata(context);
  writeDoiXml(context, metadata);

  const normalizedMetadata = readNormalizedMetadata(context);
  writeReadmeMd(context, normalizedMetadata);
  writeIndexHtml(context, metadata);
}

export function miscFiles(context) {
  for (const dataset of listDeployed(context).filter(doName => !doName.endsWith('/latest'))) {
    const doPath = resolve(context.doHome, dataset);
    const selectedDigitalObject = getDigitalObjectInformation(doPath, context.purlIri);
    miscDoFiles({ ...context, selectedDigitalObject });
  }
}
