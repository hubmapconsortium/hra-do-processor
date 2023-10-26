import { basename } from 'path';

const NAME_REMAPPING = {
  'placenta-female': 'placenta-full-term-female',
  'kidney-female': 'kidney-female-both',
  'kidney-male': 'kidney-male-both',
  'ureter-male': 'ureter-male-both'
};

export function getLandmarkMetadata(glbUrl) {
  let name = basename(glbUrl, '.glb')
    .toLowerCase()
    .replace(/\_/g, '-')
    .replace(/^3d\-/, '')
    .replace(/^vh\-/, '')
    .replace(/colon/, 'large-intestine')
    .replace(/^f-/, 'female-')
    .replace(/^m-/, 'male-')
    .replace(/-l$/, '-left')
    .replace(/-r$/, '-right')
    .replace(/-l-/, '-left-')
    .replace(/-r-/, '-right-')
    .replace(/-mapping$/, '-crosswalk');

  let suffix = '';
  if (name.includes('landmark')) {
    name = name.replace(/-landmarks*/g, '');
    suffix = '-landmarks';
  } else if (name.includes('extraction')) {
    name = name.replace(/-extractions*/, '').replace(/-sites/, '');
    suffix = '-extraction-sites';
  }

  let sex;
  if (name.includes('female')) {
    sex = 'female';
  } else if (name.includes('male')) {
    sex = 'male';
  }
  if (sex) {
    const hasLaterality = name.endsWith('-left') || name.endsWith('-right');
    const elts = name.split('-').filter((s) => s !== sex);

    // Format for reference organs = ${organ}-${sex}-${laterality "optional"}
    if (hasLaterality) {
      name = `${elts.slice(0, -1).join('-')}-${sex}-${elts.slice(-1).join('-')}`;
    } else {
      name = `${elts.join('-')}-${sex}`;
    }
  }

  name = NAME_REMAPPING[name] || name;

  const title = `3D${toTitleCase(suffix)} for ${toTitleCase(name)}`;

  let refOrgans;
  if (name.includes('both')) {
    refOrgans = [ name.replace(/-both/, '-left'), name.replace(/-both/, '-right') ];
  } else {
    refOrgans = [ name ];
  }

  const version = glbUrl.split('/').slice(-2)[0];

  return { refOrgans, name: name + suffix, version, title };
}

function toTitleCase(str) {
  return str.split('-').map(s => s ? s[0].toUpperCase() + s.slice(1) : '').join(' ');
}
