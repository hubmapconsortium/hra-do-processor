import { writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { readMetadata } from '../../normalization/utils.js';
import { getNextVersionDigitalObject, getPreviousVersionDigitalObject } from '../../utils/get-latest.js';
import { throwOnError } from '../../utils/sh-exec.js';
import { TYPE_MAPPINGS } from './doi-type-mappings.js';

function fileExtension(datatable) {
  let str = Array.isArray(datatable) ? datatable[0] : datatable;
  str = str.replace('.zip', '').replace('.7z', '');
  const ext = str !== undefined ? str.slice(str.lastIndexOf('.') + 1).replace(')', '') : '';
  return `.${TYPE_MAPPINGS.extension_fixes[ext] || ext}`;
}

function personList(list, contributorType = undefined) {
  return (
    list?.map(({ fullName, lastName, firstName, orcid }) => ({
      // name: fullName,
      name: `${lastName}, ${firstName}`,
      givenName: firstName,
      familyName: lastName,
      contributorType,
      nameIdentifiers: [
        {
          schemeUri: 'https://orcid.org',
          nameIdentifier: `https://orcid.org/${orcid}`,
          nameIdentifierScheme: 'ORCID',
        },
      ],
      affiliation: [],
    })) ?? []
  );
}

function normalizeText(str) {
  return str.replace(/\n/g, '<br>').replace(/\s+/g, ' ');
}

function getDoi(context, obj) {
  const metadata = readMetadata({ ...context, selectedDigitalObject: obj });
  return metadata.doi?.split('/').slice(-2).join('/').toLowerCase() ?? undefined;
}

function getRelatedIdentifiers(context) {
  const obj = context.selectedDigitalObject;
  const relatedIdentifiers = [];
  const previousVersion = getPreviousVersionDigitalObject(
    context.doHome,
    obj.type,
    obj.name,
    obj.version,
    context.purlIri
  );
  const nextVersion = getNextVersionDigitalObject(context.doHome, obj.type, obj.name, obj.version, context.purlIri);

  if (previousVersion) {
    const prevVersionDoi = getDoi(context, previousVersion);
    if (prevVersionDoi) {
      relatedIdentifiers.push({
        relatedIdentifierType: 'DOI',
        relatedIdentifier: prevVersionDoi,
        relationType: 'IsNewVersionOf',
        resourceTypeGeneral:
          TYPE_MAPPINGS.resource_mappings[prevVersionDoi.type] || TYPE_MAPPINGS.resource_mappings.default,
      });
    }
  }
  if (nextVersion) {
    const nextVersionDoi = getDoi(context, nextVersion);
    if (nextVersionDoi) {
      relatedIdentifiers.push({
        relatedIdentifierType: 'DOI',
        relatedIdentifier: nextVersionDoi,
        relationType: 'IsPreviousVersionOf',
        resourceTypeGeneral:
          TYPE_MAPPINGS.resource_mappings[nextVersion.type] || TYPE_MAPPINGS.resource_mappings.default,
      });
    }
  }

  return relatedIdentifiers.length > 0 ? relatedIdentifiers : undefined;
}

function extractDoiData(context, metadata) {
  const obj = context.selectedDigitalObject;
  const doi = metadata.doi.split('/').slice(-2).join('/').toLowerCase();

  return {
    data: {
      id: doi,
      type: 'dois',
      attributes: {
        doi,
        prefix: doi.split('/')[0],
        suffix: doi.split('/')[1],
        relatedIdentifiers: getRelatedIdentifiers(context),
        alternateIdentifiers: [
          {
            alternateIdentifier: `${obj.iri}/${obj.version}`,
            alternateIdentifierType: 'PURL',
          },
          {
            alternateIdentifier: metadata.hubmapId,
            alternateIdentifierType: 'HuBMAP ID',
          },
          metadata.citation
            ? {
                alternateIdentifier: normalizeText(metadata.citation),
                alternateIdentifierType: `How to Cite This ${
                  TYPE_MAPPINGS.cite_model_mappings[obj.type] || TYPE_MAPPINGS.cite_model_mappings.default
                }`,
              }
            : undefined,
          metadata.citationOverall
            ? {
                alternateIdentifier: normalizeText(metadata.citationOverall),
                alternateIdentifierType: `How to Cite ${
                  TYPE_MAPPINGS.cite_overall_model_mappings[obj.type] ||
                  TYPE_MAPPINGS.cite_overall_model_mappings.default
                } Overall`,
              }
            : undefined,
        ].filter((s) => !!s),
        creators: personList(metadata.creators),
        titles: [
          {
            title: `${metadata.title}, ${obj.version}`,
          },
        ],
        publisher: { name: metadata.publisher },
        publicationYear: metadata.creation_date.split('-')[0],
        subjects: [
          {
            subject: `${metadata.title}, ${obj.version}`,
          },
        ],
        contributors: [
          ...personList(metadata.project_leads, 'ProjectLeader'),
          ...personList(metadata.reviewers, 'Other'),
          ...personList(metadata.externalReviewers, 'Other'),
        ],
        dates: [
          {
            date: metadata.creation_date,
            dateType: 'Available',
          },
          {
            date: metadata.creation_date.split('-')[0],
            dateType: 'Issued',
          },
        ],
        language: 'EN',
        types: {
          resourceType:
            TYPE_MAPPINGS.resource_title_mappings[obj.type] || TYPE_MAPPINGS.resource_title_mappings.default,
          resourceTypeGeneral: TYPE_MAPPINGS.resource_mappings[obj.type] || TYPE_MAPPINGS.resource_mappings.default,
        },
        formats: [fileExtension(metadata.datatable)],
        version: obj.version.replace(/^v/, ''),
        rightsList: [
          {
            rights: 'Creative Commons Attribution 4.0 International',
            rightsUri: 'https://creativecommons.org/licenses/by/4.0/legalcode',
            schemeUri: 'https://spdx.org/licenses/',
            rightsIdentifier: 'cc-by-4.0',
            rightsIdentifierScheme: 'SPDX',
          },
        ],
        descriptions: [
          {
            lang: 'en-US',
            description: normalizeText(metadata.description),
            descriptionType: 'Abstract',
          },
        ],
        fundingReferences:
          metadata.funders?.map(({ awardNumber, funder }) => ({ funderName: funder, awardNumber })) ?? [],
        url: `https://entity.api.hubmapconsortium.org/redirect/${metadata.hubmapId}`,
        schemaVersion: 'http://datacite.org/schema/kernel-4',
      },
    },
  };
}

function getCurrentDirectory() {
  return resolve(new URL('.', import.meta.url).pathname);
}

function convertDoiJsonToXml(inputJson, outputXml) {
  const converter = join(getCurrentDirectory(), 'doi-json2xml.py');
  throwOnError(`python ${converter} ${inputJson} ${outputXml}`, 'Error converting DOI json to XML');
}

export function writeDoiFiles(context, metadata) {
  if (metadata.doi) {
    const obj = context.selectedDigitalObject;
    const doiData = extractDoiData(context, metadata);
    const doiJsonFile = resolve(context.deploymentHome, obj.doString, 'doi.json');
    const doiXmlFile = resolve(context.deploymentHome, obj.doString, 'doi.xml');
    writeFileSync(doiJsonFile, JSON.stringify(doiData, null, 2));
    convertDoiJsonToXml(doiJsonFile, doiXmlFile);
  }
}
