import { readFileSync, writeFileSync } from 'fs';
import nunjucks, { Environment } from 'nunjucks';
import { resolve } from 'path';

export function renderIndexHtml(templateFile, context, metadata) {
  const env = new Environment(undefined, { autoescape: false });
  env.addFilter('json', function (value) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString()
    }
    const jsonString = JSON.stringify(value, null, 2);
    return nunjucks.runtime.markSafe(jsonString)
  })
  env.addGlobal("getStructuredData", function() {
    return getStructuredData(context, metadata);
  });
  const template = readFileSync(templateFile).toString();
  const doString = context.selectedDigitalObject.doString;
  const iri = `${context.lodIri}${doString}`;
  return env.renderString(template, { ...metadata, ...context.selectedDigitalObject, iri });
}

export function writeIndexHtml(context, metadata) {
  const obj = context.selectedDigitalObject;
  const templateFile = resolve(context.processorHome, 'src/finalizing/templates/index-html.njk');
  const htmlString = renderIndexHtml(templateFile, context, metadata);
  const filePath = resolve(context.deploymentHome, obj.doString, 'index.html');
  writeFileSync(filePath, htmlString);
}

function getStructuredData(context, metadata) {
  const { title, description, doi, hubmapId, license, citation, creators, funders } = metadata;
  const { type, name, version } = context.selectedDigitalObject;
  return {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    "@id": `${context.purlIri}${type}/${name}/${version}`,
    "name": title,
    "description": description,
    "url": `${context.lodIri}${type}/${name}/${version}`,
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
       "@id": `${context.purlIri}${type}/${name}`,
       "name": `Catalog of ${type}/${name}`
    },
    "version": version
  }
}
