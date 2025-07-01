// Converted from transpiled ccf-asct-reporter code:
// https://github.com/hubmapconsortium/ccf-asct-reporter/blob/main/asctb-api/src/models/api.model.ts

export const DELIMETER = ';';
export const TITLE_ROW_INDEX = 0;

export const metadataArrayFields = [
  'author_names',
  'author_orcids',
  'reviewer_names',
  'reviewer_orcids',
  'general_publications',
];

export const metadataNameMap = {
  'Author Name(s):': 'author_names',
  'Author ORCID(s):': 'author_orcids',
  'Reviewer(s):': 'reviewer_names',
  'Reviewer ORCID(s):': 'reviewer_orcids',
  'General Publication(s):': 'general_publications',
  'Data DOI:': 'data_doi',
  'Date:': 'date',
  'Version Number:': 'version',
};

export var BM_TYPE;
(function (BM_TYPE) {
  BM_TYPE['G'] = 'gene';
  BM_TYPE['P'] = 'protein';
  BM_TYPE['BL'] = 'lipids';
  BM_TYPE['BM'] = 'metabolites';
  BM_TYPE['BF'] = 'proteoforms';
})(BM_TYPE || (BM_TYPE = {}));

export const OMAP_ORGAN = {
  'https://doi.org/10.48539/HBM467.LRKZ.884': {
    name: 'skin',
    rdfs_label: 'skin of body',
    id: 'UBERON:0002097',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  'https://doi.org/10.48539/HBM577.SBHH.454': {
    name: 'skin',
    rdfs_label: 'skin of body',
    id: 'UBERON:0002097',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  'https://doi.org/10.48539/HBM674.DJKV.876': {
    name: 'lymph node',
    rdfs_label: 'lymph node',
    id: 'UBERON: 0000029',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  'https://doi.org/10.48539/HBM794.CSBJ.358': {
    name: 'intestine',
    rdfs_label: 'intestine',
    id: 'UBERON:0000160',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  'https://doi.org/10.48539/HBM568.RMZB.377': {
    name: 'kidney',
    rdfs_label: 'kidney',
    id: 'UBERON:0002113',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  'https://doi.org/10.48539/HBM495.QBSV.777': {
    name: 'liver',
    rdfs_label: 'liver',
    id: 'UBERON:0002107',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  'https://doi.org/10.48539/HBM868.XLTM.922': {
    name: 'Pancreas',
    rdfs_label: 'Pancreas',
    id: 'UBERON:0001264',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  'https://doi.org/10.48539/HBM972.WHPW.455': {
    name: 'Lung',
    rdfs_label: 'Lung',
    id: 'UBERON:0002048',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
  default: {
    name: 'unknown',
    rdfs_label: 'unknown',
    id: 'unknown',
    setBiomarkerProperties: undefined,
    isValid: undefined,
  },
};

export var PROTEIN_PRESENCE;
(function (PROTEIN_PRESENCE) {
  PROTEIN_PRESENCE['POS'] = 'Positive';
  PROTEIN_PRESENCE['NEG'] = 'Negative';
  PROTEIN_PRESENCE['UNKNOWN'] = 'Unknown';
  PROTEIN_PRESENCE['INTERMEDIATE'] = 'Intermediate';
})(PROTEIN_PRESENCE || (PROTEIN_PRESENCE = {}));

export const ASCT_HEADER_FIRST_COLUMN = 'AS/1';
export const LEGACY_OMAP_HEADER_FIRST_COLUMN = 'uniprot_accession_number';
export const OMAP_HEADER_FIRST_COLUMN = 'omap_id';

export const arrayNameMap = {
  AS: 'anatomical_structures',
  CT: 'cell_types',
  FTU: 'ftu_types',
  BG: 'biomarkers_gene',
  BP: 'biomarkers_protein',
  BGENE: 'biomarkers_gene',
  BPROTEIN: 'biomarkers_protein',
  REF: 'references',
  BLIPID: 'biomarkers_lipids',
  BMETABOLITES: 'biomarkers_meta',
  BPROTEOFORM: 'biomarkers_prot',
  BL: 'biomarkers_lipids',
  BM: 'biomarkers_meta',
  BF: 'biomarkers_prot',
};

export const objectFieldMap = {
  ID: 'id',
  LABEL: 'rdfs_label',
  DOI: 'doi',
  NOTES: 'notes',
  NOTE: 'notes',
};

export function createObject(name, structureType) {
  switch (structureType) {
    case 'REF':
      return new Reference(name);
    case 'AS':
    default:
      return new Structure(name, structureType);
  }
}

export class Reference {
  constructor(name) {
    this.name = !this.checkIsDoi(name) ? name : '';
  }
  isValid() {
    return !!this.id;
  }
  checkIsDoi(str) {
    const doiRegex = /(10\.\d{4,9}\/[\w\-._;()/:]+)/i;
    return doiRegex.test(str);
  }
}

export class Structure {
  constructor(name, structureType) {
    this.id = '';
    this.rdfs_label = '';
    this.name = name;
    this.setBiomarkerProperties(structureType, name);
  }
  setBiomarkerProperties(structureType, name) {
    if (structureType === 'BGENE' || structureType === 'BG') {
      this.b_type = BM_TYPE.G;
    }
    if (structureType === 'BPROTEIN' || structureType === 'BP') {
      name = this.name = name.replace('Protein', '').trim();
      const hasPos = name.endsWith('+');
      const hasNeg = name.endsWith('-');
      const hasInt = name.endsWith('+/-');
      if (hasPos) {
        this.name = name.slice(0, -1);
        this.proteinPresence = PROTEIN_PRESENCE.POS;
      } else if (hasInt) {
        this.name = name.slice(0, -3).trim();
        this.proteinPresence = PROTEIN_PRESENCE.INTERMEDIATE;
      } else if (hasNeg) {
        this.name = name.slice(0, -1);
        this.proteinPresence = PROTEIN_PRESENCE.NEG;
      } else {
        this.proteinPresence = PROTEIN_PRESENCE.UNKNOWN;
      }
      this.b_type = BM_TYPE.P;
    }
    if (structureType === 'BLIPID' || structureType === 'BL') {
      this.b_type = BM_TYPE.BL;
    }
    if (structureType === 'BMETABOLITES' || structureType === 'BM') {
      this.b_type = BM_TYPE.BM;
    }
    if (structureType === 'BPROTEOFORM' || structureType === 'BF') {
      this.b_type = BM_TYPE.BF;
    }
  }
  isValid() {
    return !!this.id || !!this.name || !!this.rdfs_label;
  }
}

export class Row {
  constructor(rowNumber) {
    this.rowNumber = rowNumber;
    this.anatomical_structures = [];
    this.cell_types = [];
    this.biomarkers = [];
    this.biomarkers_protein = [];
    this.biomarkers_gene = [];
    this.biomarkers_lipids = [];
    this.biomarkers_meta = [];
    this.biomarkers_prot = [];
    this.ftu_types = [];
    this.references = [];
  }

  finalize() {
    this.anatomical_structures = this.anatomical_structures.filter((s) => s.isValid());
    this.cell_types = this.cell_types.filter((s) => s.isValid());
    this.ftu_types = this.ftu_types.filter((s) => s.isValid());
    this.references = this.references.filter((s) => s.isValid());
    
    // Remove duplicates based on 'id' property
    const seenIds = new Set();
    this.references = this.references.filter((s) => {
      if (s.id && seenIds.has(s.id)) return false;
      if (s.id) seenIds.add(s.id);
      return true;
    });
    
    this.biomarkers_gene = this.biomarkers_gene.filter((s) => s.isValid());
    this.biomarkers_protein = this.biomarkers_protein.filter((s) => s.isValid());
    this.biomarkers_lipids = this.biomarkers_lipids.filter((s) => s.isValid());
    this.biomarkers_meta = this.biomarkers_meta.filter((s) => s.isValid());
    this.biomarkers_prot = this.biomarkers_prot.filter((s) => s.isValid());
    this.biomarkers = [
      ...this.biomarkers_gene,
      ...this.biomarkers_protein,
      ...this.biomarkers_lipids,
      ...this.biomarkers_meta,
      ...this.biomarkers_prot,
    ];
  }
}
