import { resolve } from 'path';
import sh from 'shelljs';
import { readMetadata } from '../normalization/utils.js';
import { writeDoiXml } from './utils/generate-doi-xml.js';
import { writeIndexHtml } from './utils/generate-index-html.js';
import { writeReadmeMd } from './utils/generate-readme-md.js';

export function packageIt(context) {
  const obj = context.selectedDigitalObject;
  sh.mkdir('-p', resolve(obj.path, 'packaged'));

  const metadata = readMetadata(obj.path);
  writeDoiXml(context, metadata);
  writeReadmeMd(context, metadata);
  writeIndexHtml(context, metadata);
}
