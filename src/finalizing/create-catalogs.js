import { readFileSync, writeFileSync } from 'fs';
import { Environment } from 'nunjucks';
import { resolve } from 'path';
import { listDeployed } from '../list.js';
import { reifyCatalog } from '../utils/reify.js';

export function createCatalogs(context) {
  const catalog = {};
  for (const dataset of listDeployed(context)) {
    const [doType, doName, doVersion] = dataset.split('/');
    const types = (catalog[doType] = catalog[doType] || {});
    const versions = (types[doName] = types[doName] || []);
    versions.push(doVersion);
  }

  const doTypes = Object.keys(catalog).sort();
  createListing(context, '', doTypes, 'Catalog');

  for (const doType of doTypes) {
    const doNames = Object.keys(catalog[doType]).sort();
    createListing(context, doType, doNames, 'Catalog');

    for (const doName of doNames.sort()) {
      const versions = catalog[doType][doName];
      createListing(context, `${doType}/${doName}`, sortVersions(versions), 'Dataset');
    }
  }
}

function sortVersions(versions) {
  return [
    versions.find((n) => n === 'latest'),
    versions.find((n) => n === 'draft'),
    ...versions.filter((n) => n !== 'latest' && n !== 'draft'),
  ].filter((n) => !!n);
}

function createListing(context, path, items, itemType) {
  const iri = `${context.lodIri}${path ? path + '/' : path}`;
  const noSlashIri = `${context.lodIri}${path ? path + '/' : path}`;
  const lodIri = context.lodIri;
  writeIndexHtml(context, path, { iri, items, itemType, lodIri, noSlashIri });
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
