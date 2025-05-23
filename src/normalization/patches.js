export function getPatchesForAnatomicalStructure(context) {
  const patches = [
    {
      id: 'UBERON:0001062',
      conforms_to: 'AnatomicalStructure',
      parent_class: 'ccf:AnatomicalStructure',
      ccf_pref_label: 'UBERON anatomical structure',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false
    },
    {
      id: 'FMA:62955',
      conforms_to: 'AnatomicalStructure',
      parent_class: 'ccf:AnatomicalStructure',
      ccf_pref_label: 'FMA anatomical structure',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false
    },
    {
      id: 'FMA:29733',
      conforms_to: 'AnatomicalStructure',
      parent_class: 'ccf:AnatomicalStructure',
      ccf_pref_label: 'General anatomical term',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false
    },
    {
      id: 'UBERON:0013702',
      conforms_to: 'AnatomicalStructure',
      ccf_pref_label: 'body proper',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false
    },
  ];
  const { selectedDigitalObject: obj } = context;
  const organName = obj.name;
  let organSpecificPatches = [];
  if (organName === 'kidney') {
    organSpecificPatches = [
      {
        id: 'UBERON:0004538',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'left kidney',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0002113'],
      },
      {
        id: 'UBERON:0004539',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'right kidney',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0002113'],
      },
    ];
  } else if (organName === 'bonemarrow-pelvis') {
    organSpecificPatches = [
      {
        id: 'UBERON:0001270',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'pelvis',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0013702'],
      },
      {
        id: 'UBERON:0002371',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'bone marrow',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0001270'],
      },
    ];
  } else if (organName === 'blood-pelvis') {
    organSpecificPatches = [
      {
        id: 'UBERON:0001270',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'pelvis',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0013702'],
      },
      {
        id: 'UBERON:0000178',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'blood',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0001270'],
      },
    ];
  } else if (organName === 'blood-vasculature') {
    organSpecificPatches = [
      {
        id: 'UBERON:0004537',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'blood vasculature',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0013702'],
      },
    ];
  } else if (organName === 'lung') {
    organSpecificPatches = [
      {
        id: 'UBERON:0002048',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'lung',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0013702'],
      },
      {
        id: 'UBERON:0001004',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'respiratory system',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0002048'],
      },
    ];
  } else if (organName === 'lymph-node') {
    organSpecificPatches = [
      {
        id: 'UBERON:0002509',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'mesenteric lymph node',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0000029'],
      },
    ];
  } else if (organName === 'eye') {
    organSpecificPatches = [
      {
        id: 'UBERON:0004548',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'left eye',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0000970'],
      },
      {
        id: 'UBERON:0004549',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'right eye',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0000970'],
      },
    ];
  } else if (organName === 'fallopian-tube') {
    organSpecificPatches = [
      {
        id: 'UBERON:0001303',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'left fallopian tube',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0003889'],
      },
      {
        id: 'UBERON:0001302',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'right fallopian tube',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0003889'],
      },
    ];
  } else if (organName === 'knee') {
    organSpecificPatches = [
      {
        id: 'FMA:24978',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'left knee',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0001465'],
      },
      {
        id: 'FMA:24977',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'right knee',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0001465'],
      },
    ];
  } else if (organName === 'mammary-gland') {
    organSpecificPatches = [
      {
        id: 'UBERON:0001911',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'mammary gland',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0013702'],
      },
      {
        id: 'FMA:57991',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'left mammary gland',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0001911'],
      },
      {
        id: 'FMA:57987',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'right mammary gland',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0001911'],
      },
    ];
  } else if (organName === 'ovary') {
    organSpecificPatches = [
      {
        id: 'UBERON:0002119',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'left ovary',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0000992'],
      },
      {
        id: 'UBERON:0002118',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'right ovary',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0000992'],
      },
    ];
  } else if (organName === 'ureter') {
    organSpecificPatches = [
      {
        id: 'UBERON:0001223',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'left ureter',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0000056'],
      },
      {
        id: 'UBERON:0001222',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'right ureter',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0000056'],
      },
    ];
  } else if (organName === 'spinal-cord') {
    organSpecificPatches = [
      {
        id: 'UBERON:0002240',
        conforms_to: 'AnatomicalStructure',
        ccf_pref_label: 'spinal cord',
        ccf_asctb_type: 'AS',
        ccf_is_provisional: false,
        ccf_part_of: ['UBERON:0013702'],
      },
    ];
  }
  return patches.concat(organSpecificPatches);
}

export function getPatchesForCellType() {
  const patches = [
    {
      id: 'CL:0000000',
      conforms_to: 'CellType',
      parent_class: 'ccf:CellType',
      ccf_pref_label: 'CL cell type',
      ccf_asctb_type: 'CT',
      ccf_is_provisional: false
    },
    {
      id: 'LMHA:00135',
      conforms_to: 'CellType',
      parent_class: 'ccf:CellType',
      ccf_pref_label: 'LMHA cell type',
      ccf_asctb_type: 'CT',
      ccf_is_provisional: false
    },
  ];
  return patches;
}

export function getPatchesForBiomarker() {
  const patches = [
    {
      id: 'HGNCO:gene',
      conforms_to: 'Biomarker',
      parent_class: 'ccf:Biomarker',
      ccf_pref_label: 'gene',
      ccf_asctb_type: 'BM',
      ccf_is_provisional: false,
      ccf_biomarker_type: 'gene'
    },
  ];
  return patches;
}

export function normalizeDoi(doi) {
  let normDoi = doi.replace(/\s+/g, '');

  // Case 1: 10.1016/j.exphem.2018.09.004
  if (/^10\.\d+\/.*/.test(normDoi)) {
    normDoi = normDoi.replace(/^(10\.\d+\/.*)/, 'https://doi.org/$1');
  }
  // Case 2: DOI:10.1016/j.exphem.2018.09.004
  else if (/^(?:DOI|doi):.*/.test(normDoi)) {
    normDoi = normDoi.replace(/^(DOI|doi):\s*/, 'https://doi.org/');
  }
  // Case 3: doi.org/10.1016/j.exphem.2018.09.004
  else if (/^doi\.org\/.*/.test(normDoi)) {
    normDoi = normDoi.replace(/^doi\.org\//, 'https://doi.org/');
  }
  // Case 4: dx.doi.org/10.1016/j.exphem.2018.09.004
  else if (/^dx\.doi\.org\/.*/.test(normDoi)) {
    normDoi = normDoi.replace(/^dx\.doi\.org\//, 'https://dx.doi.org/');
  }
  return normDoi;
}

export function normalizeString(str) {
  return str.replace(/"/g, "'")  // Replace all double quotes with single quotes
    .replace(/\r/g, "")  // Remove carriage return characters
    .replace(/\s+/g, " ")  // Replace multiple spaces (including leading/trailing spaces) with a single space
    .trim();
}

export function normalizeDate(originalDate) {
  const date = new Date(originalDate);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
}


export function isIdValid(id) {
  return /(UBERON|FMA|CL|PCL|LMHA|HGNC):\d+|https\:\/\/purl.org\/ccf\/ASCTB\-TEMP\_[a-zA-Z0-9\-]+/.test(id);
}

export function isAsIdValid(id) {
  return /(UBERON|FMA):\d+|https\:\/\/purl.org\/ccf\/ASCTB\-TEMP\_[a-zA-Z0-9\-]+/.test(id);
}

export function isCtIdValid(id) {
  return /(CL|PCL|LMHA):\d+|https\:\/\/purl.org\/ccf\/ASCTB\-TEMP\_[a-zA-Z0-9\-]+/.test(id);
}
