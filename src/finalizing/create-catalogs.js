import { listDeployed } from "../list.js";
import { readFileSync, writeFileSync } from 'fs';
import { Environment } from 'nunjucks';
import { resolve } from 'path';
import { reifyCatalog } from '../utils/reify.js';

export function createCatalogs(context) {
  const catalog = {};
  for (const dataset of listDeployed(context)) {
    const [doType, doName, doVersion] = dataset.split('/');
    const types = catalog[doType] = catalog[doType] || {};
    const versions = types[doName] = types[doName] || [];
    versions.push(doVersion);
  }

  const doTypes = Object.keys(catalog).sort();
  createListing(context, '', doTypes, 'Catalog');

  for (const doType of doTypes) {
    const doNames = Object.keys(catalog[doType]).sort();
    createListing(context, doType, doNames, 'Catalog');

    for (const doName of doNames.sort()) {
      const versions = catalog[doType][doName];
      createListing(context, `${doType}/${doName}`, versions, 'Dataset');
    }
  }
}

function createListing(context, path, items, itemType) {
  const iri = `${context.lodIri}${path ? path + '/' : path}`;
  writeIndexHtml(context, path, { iri, items, itemType });
  reifyCatalog(context, iri, path);
}

export function writeIndexHtml(context, path, data) {
  const templateFile = resolve(context.processorHome, 'src/finalizing/templates/catalog-html.njk');
  const htmlString = renderTemplate(templateFile, data);
  const filePath = resolve(context.deploymentHome, path, 'index.html');
  writeFileSync(filePath, htmlString);
}

export function renderTemplate(templateFile, data) {
  const env = new Environment(undefined, { autoescape: false });
  const template = readFileSync(templateFile).toString();
  return env.renderString(template, data);
}
