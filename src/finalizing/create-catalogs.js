import { readFileSync, writeFileSync } from 'fs';
import nunjucks, { Environment } from 'nunjucks';
import { resolve } from 'path';
import { listDeployed } from '../list.js';
import { getLatestDigitalObject } from '../utils/get-latest.js';
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
      const latest = getLatestDigitalObject(context.doHome, doType, doName, context.lodIri);
      const latestVersion = latest.version;
      createListing(context, `${doType}/${doName}`, sortVersions(versions), 'Dataset', latestVersion);
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

function createListing(context, path, items, itemType, latestVersion) {
  const iri = `${context.lodIri}${path ? path + '/' : path}`;
  const noSlashIri = iri.replace(/\/+$/, '');
  const lodIri = context.lodIri;
  const purlIri = `${context.purlIri}${path}`;
  const includeBaseHref = !context.excludeBaseHref;
  writeIndexHtml(context, path, { iri, items, itemType, lodIri, noSlashIri, includeBaseHref, latestVersion, purlIri });
  reifyCatalog(context, iri, path);
}

export function writeIndexHtml(context, path, data) {
  const templateFile = resolve(context.processorHome, 'src/finalizing/templates/catalog-html.njk');
  const htmlString = renderTemplate(context, templateFile, data);
  const filePath = resolve(context.deploymentHome, path, 'index.html');
  writeFileSync(filePath, htmlString);
  const filePath2 = resolve(context.deploymentHome, path, 'metadata.json');
  writeFileSync(filePath2, JSON.stringify(getStructuredData(context, data), null, 2));
}

export function renderTemplate(context, templateFile, data) {
  const env = new Environment(undefined, { autoescape: false });
  env.addFilter('json', function (value) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }
    const jsonString = JSON.stringify(value, null, 2);
    return nunjucks.runtime.markSafe(jsonString);
  });
  env.addGlobal('getStructuredData', function () {
    return getStructuredData(context, data);
  });
  const template = readFileSync(templateFile).toString();
  return env.renderString(template, data);
}

function getStructuredData(context, metadata) {
  return {
    '@context': {
      '@vocab': 'http://www.w3.org/ns/dcat#',
      dcat: 'http://www.w3.org/ns/dcat#',
      dct: 'http://purl.org/dc/terms/',
      title: {
        '@id': 'dct:title',
        '@language': 'en',
      },
      latest: {
        '@type': '@id',
        '@reverse': 'dcat:hasCurrentVersion',
      },
      parent: {
        '@type': '@id',
        '@reverse': 'dcat:dataset',
      },
    },
    '@graph': metadata.items.map((item) => ({
      '@id': `${metadata.noSlashIri}/${item}`,
      '@type': metadata.itemType,
      title: item,
      parent: metadata.noSlashIri,
      latest: item === metadata.latestVersion ? metadata.noSlashIri : undefined,
    })),
  };
}
