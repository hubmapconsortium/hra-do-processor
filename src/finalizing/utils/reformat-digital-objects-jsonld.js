import { coerce, rsort } from 'semver';

export function reformatDigitalObjectsJsonld(jsonld) {
  const results = normalizeJsonLd(ensureGraphArray(jsonld), new Set(['hraVersions', 'versions', 'organs', 'organIds']));
  for (const result of results) {
    result.hraVersions = sortVersions(result.hraVersions || []);
    result.versions = sortVersions(result.versions);
    results.cell_count = ensureNumber(results.cell_count) || 0;
    results.biomarker_count = ensureNumber(results.biomarker_count) || 0;
  }
  return {
    '@context': jsonld['@context'],
    '@graph': results,
  };
}

function sortVersions(versions) {
  return rsort(
    versions.map((version) => {
      const semver = coerce(version, true) ?? coerce('v9999', true);
      semver.original = version;
      return semver;
    })
  ).map((semver) => semver.original);
}

function expandIri(iri) {
  return iri && typeof iri === 'string'
    ? iri
        .replace('ccf:', 'http://purl.org/ccf/')
        .replace('ccf1:', 'http://purl.org/ccf/latest/ccf.owl#')
        .replace('../sig/ont/fma/fma', 'http://purl.org/sig/ont/fma/fma')
        .replace('fma:', 'http://purl.org/sig/ont/fma/fma')
        .replace('http://purl.obolibrary.org/obo/FMA_', 'http://purl.org/sig/ont/fma/fma')
    : iri;
}

const DEFAULT_STRING_FIELDS = ['creator', 'creator_first_name', 'creator_last_name'];

function normalizeJsonLd(
  jsonld,
  arrayFields = new Set(),
  stringFields = new Set(DEFAULT_STRING_FIELDS),
  singleValueFields = new Set()
) {
  return JSON.parse(JSON.stringify(jsonld), (key, value) => {
    if (singleValueFields.has(key)) {
      value = ensureSingleValue(value);
    }
    if (arrayFields.has(key)) {
      value = ensureArray(value);
    }
    if (stringFields.has(key)) {
      value = ensureString(value);
    }
    if (
      typeof value === 'object' &&
      value?.['@type'] &&
      value['@value'] &&
      (value['@type'].startsWith('xsd:') || value['@type'].startsWith('http://www.w3.org/2001/XMLSchema#'))
    ) {
      switch (value['@type']) {
        case 'http://www.w3.org/2001/XMLSchema#integer':
        case 'http://www.w3.org/2001/XMLSchema#double':
        case 'http://www.w3.org/2001/XMLSchema#decimal':
        case 'xsd:integer':
        case 'xsd:double':
        case 'xsd:decimal':
          return Number(value['@value']);
        case 'http://www.w3.org/2001/XMLSchema#date':
        case 'xsd:date':
          return value['@value'];
        default:
          return value;
      }
    } else if (Array.isArray(value)) {
      return value.map(expandIri);
    } else {
      return expandIri(value);
    }
  });
}

function ensureSingleValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  } else {
    return value;
  }
}

function ensureString(value, arrayElementSeparator = '; ') {
  if (Array.isArray(value)) {
    return value.map(ensureString).join(arrayElementSeparator);
  } else if (value?.['@value']) {
    return value['@value'];
  } else {
    return value;
  }
}

function ensureArray(thing) {
  if (Array.isArray(thing)) {
    return thing;
  } else if (thing) {
    return [thing];
  } else {
    return [];
  }
}

function ensureNumber(value) {
  if (value?.['@type']) {
    return Number(value['@value']);
  } else if (typeof value === 'string') {
    return Number(value);
  } else {
    return value;
  }
}

function ensureGraphArray(results) {
  if (results?.['@graph']) {
    return results['@graph'];
  } else if (results?.['@id']) {
    delete results['@context'];
    return [results];
  } else {
    return [];
  }
}
