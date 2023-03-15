import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import fetch from 'node-fetch';
import { resolve } from 'path';
import sh from 'shelljs';
import { validateNormalized } from '../utils/validation.js';
import { readMetadata, writeNormalized } from './utils.js';

const ASCTB_API = 'https://mmpyikxkcp.us-east-2.awsapprunner.com/';

export async function normalizeAsctb(context) {
  const obj = context.selectedDigitalObject;
  const metadata = readMetadata(obj);

  const dataUrl = Array.isArray(metadata.datatable) ? metadata.datatable[0] : metadata.datatable;
  let requestUrl = ASCTB_API + 'v2/csv';
  let data;
  if (dataUrl.startsWith('http')) {
    requestUrl +=
      '?' +
      new URLSearchParams({
        csvUrl: dataUrl,
        cached: true,
      });
    data = await fetch(requestUrl).then((r) => r.json());
  } else {
    const formData = new FormData();
    const dataPath = resolve(obj.path, 'raw', dataUrl);
    formData.append(
      'csvFile',
      new Blob([readFileSync(dataPath).toString()], { type: 'text/csv', path: dataPath }),
      dataUrl
    );
    data = await fetch(requestUrl, { method: 'POST', body: formData }).then((r) => r.json());
  }
  const normalizedData = normalizeAsctbApiResponse(data.data);

  writeNormalized(obj, metadata, normalizedData);
  validateNormalized(context);

  // If warnings are found in the response, save for reference.
  const warningsFile = resolve(obj.path, 'normalized/warnings.yaml');
  sh.rm('-f', warningsFile); // Clear previous warnings file
  if (!context.skipValidation && data.warnings?.length > 0) {
    writeFileSync(warningsFile, dump({ warnings: data.warnings }));
    console.log(
      chalk.yellow('Warnings were reported by the ASCTB-API.'),
      'This may indicate further errors that need resolved. Please review the warnings at',
      warningsFile
    );
  }
}

function normalizeAsctbApiResponse(data) {
  const normalizedData = data.reduce((newData, oldRecord) => {
    newData.push({
      anatomical_structures: normalizeAnatomicalStructures(oldRecord.anatomical_structures),
      cell_types: normalizeCellTypes(oldRecord.cell_types),
      biomarkers: normalizeBiomarkers(oldRecord.biomarkers),
      biomarkers_protein: normalizeBiomarkers(oldRecord.biomarkers_protein),
      biomarkers_gene: normalizeBiomarkers(oldRecord.biomarkers_gene),
      biomarkers_lipids: normalizeBiomarkers(oldRecord.biomarkers_lipids),
      biomarkers_meta: normalizeBiomarkers(oldRecord.biomarkers_meta),
      biomarkers_prot: normalizeBiomarkers(oldRecord.biomarkers_prot),
      ftu_types: normalizeFtuTypes(oldRecord.ftu_types),
      references: normalizeReferences(oldRecord.references),
    });
    return newData;
  }, []);
  return normalizedData;
}

function normalizeAnatomicalStructures(arr, excludeIdlessObject = true) {
  return arr
    .filter((item) => excludeIdlessObject && item.id !== '')
    .map((item) => ({
      id: expandId(item.id),
      label: item.rdfs_label,
      preferred_name: item.name,
    }))
    .filter(removeDuplicate);
}

function normalizeCellTypes(arr, excludeIdlessObject = true) {
  return arr
    .filter((item) => excludeIdlessObject && item.id !== '')
    .map((item) => ({
      id: expandId(item.id),
      label: item.rdfs_label,
      preferred_name: item.name,
    }))
    .filter(removeDuplicate);
}

function normalizeBiomarkers(arr, excludeIdlessObject = true) {
  return arr
    .filter((item) => excludeIdlessObject && item.id !== '')
    .map((item) => ({
      id: expandId(item.id),
      label: item.rdfs_label,
      preferred_name: item.name,
      biomarker_type: item.b_type,
    }))
    .filter(removeDuplicate);
}

function normalizeFtuTypes(arr, excludeIdlessObject = true) {
  return arr
    .filter((item) => excludeIdlessObject && item.id !== '')
    .map((item) => ({
      id: expandId(item.id),
      label: item.rdfs_label,
      preferred_name: item.name,
    }))
    .filter(removeDuplicate);
}

function normalizeReferences(arr, excludeIdlessObject = true) {
  return arr
    .filter((item) => excludeIdlessObject && item.doi !== '')
    .map((item) => ({
      id: expandId(item.doi),
      doi: printDoi(item.doi),
      pubmed_id: item.id,
    }))
    .filter(removeDuplicate);
}

function expandId(id) {
  return id
    .replace(/^UBERON:/, 'http://purl.obolibrary.org/obo/UBERON_')
    .replace(/^FMA:/, 'http://purl.org/sig/ont/fma/fma')
    .replace(/^CL:/, 'http://purl.obolibrary.org/obo/CL_')
    .replace(/^HGNC:/, 'http://identifiers.org/hgnc/')
    .replace(/^DOI:/, 'https://doi.org/')
    .replace(/\s+/g, '');
}

function printDoi(doi) {
  return doi.replace(/^DOI:/, '').replace(/\s+/g, '');
}

function removeDuplicate(obj, index, arr) {
  return index === arr.findIndex((item) => item.id === obj.id);
}
