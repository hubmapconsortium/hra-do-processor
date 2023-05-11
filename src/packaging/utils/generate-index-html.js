import { readFileSync, writeFileSync } from 'fs';
import { Environment } from 'nunjucks';
import { resolve } from 'path';

export function renderIndexHtml(templateFile, metadata) {
  const env = new Environment(undefined, { autoescape: false });
  const template = readFileSync(templateFile).toString();
  return env.renderString(template, metadata);
}

export function writeIndexHtml(context, metadata) {
  const obj = context.selectedDigitalObject;
  const templateFile = resolve(context.processorHome, 'src/packaging/templates/index-html.njk');
  const htmlString = renderIndexHtml(templateFile, metadata);
  const filePath = resolve(obj.path, 'packaged/index.html');
  writeFileSync(filePath, htmlString);
}
