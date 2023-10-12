import { readFileSync, writeFileSync } from 'fs';
import nunjucks, { Environment } from 'nunjucks';
import { resolve } from 'path';

export function renderIndexHtml(templateFile, metadata) {
  const env = new Environment(undefined, { autoescape: false });
  env.addFilter('json', function (value) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString()
    }
    const jsonString = JSON.stringify(value, null, 2);
    return nunjucks.runtime.markSafe(jsonString)
  })
  env.addGlobal("getStructuredData", function() {
    return getStructuredData(metadata);
  });
  const template = readFileSync(templateFile).toString();
  return env.renderString(template, metadata);
}

export function writeIndexHtml(context, metadata) {
  const obj = context.selectedDigitalObject;
  const templateFile = resolve(context.processorHome, 'src/finalizing/templates/index-html.njk');
  const htmlString = renderIndexHtml(templateFile, metadata);
  const filePath = resolve(context.deploymentHome, obj.doString, 'index.html');
  writeFileSync(filePath, htmlString);
}

function getStructuredData(metadata) {
  const { title, description, type, name, version, doi, hubmapId, license, citation, creators, funders } = metadata;
  return {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    "@id": `https://purl.humanatlas.io/${type}/${name}/${version}`,
    "name": title,
    "description": description,
    "url": `https://lod.humanatlas.io/${type}/${name}/${version}`,
    "identifier": [doi, hubmapId],
    "license" : license.match(/(https?:\/\/[^ )]*)/)[0],
    "isAccessibleForFree" : true,
    "creator": creators.map((creator) => ({
        "@type": "Person",
        "givenName": creator.firstName,
        "familyName": creator.lastName,
        "name": creator.fullName,
        "sameAs": `https://orcid.org/${creator.orcid}`
      })),
    "funder": funders.map((funder) => ({
         "@type": "Organization",
         "name": funder.funder
      })),
    "citation": citation,
    "includedInDataCatalog":{
       "@type": "DataCatalog",
       "@id": `https://purl.humanatlas.io/${type}/${name}`,
       "name": `Catalog of ${type}/${name}`
    },
    "version": version
  }
}
