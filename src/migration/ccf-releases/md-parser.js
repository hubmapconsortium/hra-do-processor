import { readFileSync } from 'fs';
import { basename } from 'path';

const NAME_REMAPPING = {
  'asctb-3d-models-crosswalk': 'asct-b-3d-models-crosswalk',
  'asctb-crosswalk': 'asct-b-2d-models-crosswalk',
  'bone-marrow-pelvis': 'bonemarrow-pelvis',
  'intestine-large': 'large-intestine',
  'ln-ibex': '1-human-lymph-node-ibex',
  'lymph-node-ibex': '1-human-lymph-node-ibex',
  'intestines-codex': '2-intestine-codex',
  'kidney-codex': '3-kidney-codex',
  'skin-celldive': '4-skin-cell-dive',
  'liver-sim': '5-liver-sims',
  'pancreas-codex': '6-pancreas-codex',
  'lung-celldive': '7-lung-cell-dive',
  'intestine-large-male': 'large-intestine-male',
  'intestine-large-female': 'large-intestine-female',
  'vasculature-male': 'blood-vasculature-male',
  'vasculature-female': 'blood-vasculature-female',
  vasculature: 'blood-vasculature',
  brain: 'allen-brain',
  'bone-marrow-and-blood': 'bonemarrow-pelvis',
};

export class HraMarkdownParser {
  constructor(inputFile) {
    this.inputFile = inputFile;
    this.rawMd = readFileSync(inputFile)
      .toString()
      .replace(/\&ouml\;/g, 'ö')
      .trim()
      .split('\n');
  }

  hasKey(key) {
    return !!this.rawMd.find((l) => l.includes(`**${key}:**`));
  }
  getMetadata(key) {
    if (!this.hasKey(key)) {
      return '';
    }
    return this.rawMd
      .find((l) => l.includes(`**${key}:**`))
      .split('|')[2]
      .trim();
  }
  getMultiValue(key) {
    return this.getMetadata(key)
      .replace('&ouml;', 'ö')
      .split(/[\;\,]\ */g)
      .map((n) => n.trim());
  }
  getAccessedDate(dateStr) {
    const [_dayOfWeek, month, day, year] = new Date(dateStr).toDateString().split(' ');
    return `${month} ${parseInt(day, 10)}, ${year}`;
  }
  getAuthors(nameKey, orcidKey) {
    if (!this.hasKey(nameKey) || !this.hasKey(orcidKey)) {
      return [];
    }
    const names = this.getMultiValue(nameKey);
    const orcids = this.getMultiValue(orcidKey).map((n) => n.slice(n.indexOf('[') + 1, n.indexOf(']')).trim());
    return names.map((fullName, index) => ({
      fullName,
      firstName: fullName.split(/\ +/g).slice(0)[0],
      lastName: fullName.replace(/\ II$/g, '').split(/\ +/g).slice(-1)[0],
      orcid: orcids[index],
    }));
  }
  getFunders(funderKey, awardKey) {
    const funders = this.getMultiValue(funderKey);
    const awards = this.getMultiValue(awardKey);

    return awards.map((awardNumber, index) => ({
      funder: funders[index] || (funders?.slice(-1)[0] ?? undefined),
      awardNumber,
    }));
  }

  getName() {
    let name = basename(this.inputFile, '.md')
      .replace(this.getDoType() + '-', '')
      .replace(/^3d\-/, '')
      .replace(/^vh\-/, '')
      .replace(/^f-/, 'female-')
      .replace(/^m-/, 'male-')
      .replace(/-l$/, '-left')
      .replace(/-r$/, '-right')
      .replace(/-mapping$/, '-crosswalk');

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

    return name;
  }
  getTitle() {
    return this.rawMd[0].slice(1).trim().split(' ').slice(0, -1).join(' ').trim().replace(/,$/, '');
  }
  getVersion() {
    return this.rawMd[0].slice(1).trim().split(' ').slice(-1)[0];
  }
  getDescription() {
    return this.rawMd[this.rawMd.findIndex((n) => n.startsWith('### Description')) + 1].trim();
  }
  getHowToCiteKey() {
    return this.rawMd
      .find((l) => l.includes('**How to Cite') && !l.includes('Overall:**'))
      .split('|')[1]
      .trim()
      .replace(/\*/g, '')
      .replace(/\:/g, '');
  }
  getHowToCiteOverallKey() {
    return this.rawMd
      .find((l) => l.includes('**How to Cite') && l.includes('Overall:**'))
      .split('|')[1]
      .trim()
      .replace(/\*/g, '')
      .replace(/\:/g, '');
  }

  getDoType() {
    return this.inputFile.split('/').slice(-2)[0].replace('ref-organs', 'ref-organ');
  }

  getDoString() {
    return [this.getDoType(), this.getName(), this.getVersion()].join('/');
  }

  toJson() {
    return {
      title: this.getTitle(),
      description: this.getDescription(),

      creators: [
        ...this.getAuthors('Creator(s)', 'Creator ORCID(s)'),
        ...this.getAuthors('Creator(s)', 'Creator ORCID'),
      ],
      project_leads: this.getAuthors('Project Lead', 'Project Lead ORCID'),
      reviewers: [
        ...this.getAuthors('Reviewer(s)', 'Reviewers ORCID(s)'),
        ...this.getAuthors('Reviewer(s)', 'Reviewer ORCID(s)'),
        ...this.getAuthors('Internal Reviewer(s)', 'Internal Reviewer ORCID(s)'),
      ],
      externalReviewers: this.getAuthors('External Reviewer(s)', 'External Reviewer ORCID(s)'),

      creation_date: this.getMetadata('Creation Date') || this.getMetadata('Date'),
      creation_year: (this.getMetadata('Creation Date') || this.getMetadata('Date')).split('-')[0],
      accessed_date: this.getAccessedDate(this.getMetadata('Creation Date') || this.getMetadata('Date')),

      license: this.getMetadata('License'),
      publisher: this.getMetadata('Publisher'),
      funders: this.getFunders('Funder', 'Award Number'),
      hubmapId: this.getMetadata('HuBMAP ID'),
      dataTable: this.getMetadata('Data Table') || this.getMetadata('3D Data') || this.getMetadata('2D Data'),
      doi: this.getMetadata('DOI').split('[')[1].split(']')[0],
      citation: this.getMetadata(this.getHowToCiteKey()),
      citationOverall: this.getMetadata(this.getHowToCiteOverallKey()),
    };
  }
}
