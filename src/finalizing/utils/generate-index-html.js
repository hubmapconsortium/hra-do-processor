import { readFileSync, writeFileSync } from 'fs';
import nunjucks, { Environment } from 'nunjucks';
import { resolve } from 'path';

export function renderIndexHtml(templateFile, context, metadata) {
  const env = new Environment(undefined, { autoescape: false });
  env.addFilter('json', function (value) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }
    const jsonString = JSON.stringify(value, null, 2);
    return nunjucks.runtime.markSafe(jsonString);
  });
  env.addGlobal('getStructuredData', function () {
    return getStructuredData(context, metadata);
  });
  const template = readFileSync(templateFile).toString();
  const doString = context.selectedDigitalObject.doString;
  const iri = `${context.lodIri}${doString}`;
  const lodIri = context.lodIri;
  const includeBaseHref = !context.excludeBaseHref;
  return env.renderString(template, { ...metadata, ...context.selectedDigitalObject, iri, lodIri, includeBaseHref });
}

export function writeIndexHtml(context, metadata) {
  const obj = context.selectedDigitalObject;
  const templateFile = resolve(context.processorHome, 'src/finalizing/templates/index-html.njk');
  const htmlString = renderIndexHtml(templateFile, context, metadata);
  const filePath = resolve(context.deploymentHome, obj.doString, 'index.html');
  writeFileSync(filePath, htmlString);
}

function getStructuredData(context, metadata) {
  const { title, description, creators, creation_date, license, distributions, was_derived_from } = metadata;
  const { type, name, version } = context.selectedDigitalObject;
  return {
    '@context': 'http://schema.org/',
    '@type': 'Dataset',
    '@id': `${context.lodIri}${type}/${name}/${version}`,
    name: title,
    description: description,
    version: version,
    dateCreated: creation_date,
    license: license,
    isAccessibleForFree: true,
    creator: creators?.map((creator) => generateCreator(creator)),
    distribution: distributions.map((distribution) => generateDataDownload(distribution)),
    isBasedOn: {
      '@type': 'Dataset',
      name: was_derived_from.title,
      description: was_derived_from.description,
      identifier: [was_derived_from.doi, was_derived_from.hubmapId],
      license: was_derived_from.license.match(/(https?:\/\/[^ )]*)/)[0],
      isAccessibleForFree: true,
      creator: was_derived_from.creators?.map((creator) => generateCreator(creator)),
      funder: was_derived_from.funders?.map((funder) => ({
        '@type': 'Organization',
        name: funder.funder,
      })),
      citation: was_derived_from.citation,
      references: was_derived_from.references,
      includedInDataCatalog: {
        '@type': 'DataCatalog',
        '@id': `${context.lodIri}${type}/${name}`,
        name: `Catalog of ${type}/${name}`,
      },
      version: was_derived_from.version,
      distribution: was_derived_from.distributions.map((distribution) => generateDataDownload(distribution))
    }
  };
}

function generateCreator(creator) {
  switch (creator.conforms_to) {
    case 'SoftwareApplication':
      return {
        '@type': 'SoftwareApplication',
        name: creator.name,
        version: creator.version,
        applicationCategory: 'Data Processing',
        operatingSystem: 'Windows, Linux, macOS',
        target_product: creator?.target_product,
        sameAs: creator.id
      };
    case 'Person':
      return {
        '@type': 'Person',
        givenName: creator.firstName,
        familyName: creator.lastName,
        name: creator.fullName,
        sameAs: creator.id,
      };
    case 'Organization':
      return {
        '@type': 'Organization',
        name: creator.name,
        sameAs: creator.id,
      };
    default:
      return {
        '@type': 'Thing',
        name: creator.name,
        sameAs: creator.id,
      };
  }
}

function generateDataDownload(distribution) {
  return {
    '@type': 'DataDownload',
    name: distribution.title,
    contentUrl: distribution.downloadUrl,
    encodingFormat: distribution.mediaType,
    sameAs: distribution.id
  };
}
