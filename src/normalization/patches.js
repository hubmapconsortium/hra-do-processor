export function getPatchesForAnatomicalStructure(context) {
  const patches = [{
      id: 'UBERON:0001062',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'UBERON anatomical structure',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_designated_parent: 'ccf:AnatomicalStructure'
    }, {
      id: 'FMA:62955',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'FMA anatomical structure',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_designated_parent: 'ccf:AnatomicalStructure'
    }, {
      id: 'UBERON:0013702',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'body proper',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
    }];
  const { selectedDigitalObject: obj } = context;
  const organName = obj.name;
  let organSpecificPatches = []
  if (organName === "kidney") {
    organSpecificPatches = [{
      id: 'UBERON:0004538',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'left kidney',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0002113' ],
    }, {
      id: 'UBERON:0004539',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'right kidney',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0002113' ],
    }];
  } else if (organName === "bonemarrow-pelvis") {
    organSpecificPatches = [{
      id: 'UBERON:0001270',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'pelvis',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0013702' ],
    }, {
      id: 'UBERON:0002371',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'bone marrow',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0001270' ],
    }];
  } else if (organName === "blood-pelvis") {
    organSpecificPatches = [{
      id: 'UBERON:0001270',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'pelvis',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0013702' ],
    }, {
      id: 'UBERON:0000178',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'blood',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0001270' ],
    }];
  } else if (organName === "blood-vasculature") {
    organSpecificPatches = [{
      id: 'UBERON:0004537',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'blood vasculature',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0013702' ],
    }];
  } else if (organName === "lung") {
    organSpecificPatches = [{
      id: 'UBERON:0002048',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'lung',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0013702' ],
    }, {
      id: 'UBERON:0001004',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'respiratory system',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0002048' ],
    }];
  } else if (organName === "lymph-node") {
    organSpecificPatches = [{
      id: 'UBERON:0002509',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'mesenteric lymph node',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0000029' ],
    }];
  } else if (organName === "eye") {
    organSpecificPatches = [{
      id: 'UBERON:0004548',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'left eye',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0000970' ],
    }, {
      id: 'UBERON:0004549',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'right eye',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0000970' ],
    }];
  } else if (organName === "fallopian-tube") {
    organSpecificPatches = [{
      id: 'UBERON:0001303',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'left fallopian tube',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0003889' ],
    }, {
      id: 'UBERON:0001302',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'right fallopian tube',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0003889' ],
    }];
  } else if (organName === "knee") {
    organSpecificPatches = [{
      id: 'FMA:24978',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'left knee',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0001465' ],
    }, {
      id: 'FMA:24977',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'right knee',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0001465' ],
    }];
  } else if (organName === "mammary-gland") {
    organSpecificPatches = [{
      id: 'UBERON:0001911',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'mammary gland',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0013702' ],
    }, {
      id: 'FMA:57991',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'left mammary gland',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0001911' ],
    }, {
      id: 'FMA:57987',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'right mammary gland',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0001911' ],
    }];
  } else if (organName === "ovary") {
    organSpecificPatches = [{
      id: 'FMA:7214',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'left ovary',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0000992' ],
    }, {
      id: 'FMA:7213',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'right ovary',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0000992' ],
    }];
  } else if (organName === "ureter") {
    organSpecificPatches = [{
      id: 'UBERON:0001223',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'left ureter',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0000056' ],
    }, {
      id: 'UBERON:0001222',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'right ureter',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0000056' ],
    }];
  } else if (organName === "spinal-cord") {
    organSpecificPatches = [{
      id: 'UBERON:0002240',
      class_type: 'AnatomicalStructure',
      ccf_pref_label: 'spinal cord',
      ccf_asctb_type: 'AS',
      ccf_is_provisional: false,
      ccf_part_of: [ 'UBERON:0013702' ],
    }];
  }
  return patches.concat(organSpecificPatches);
}

export function getPatchesForCellType() {
  const patches = [{
    id: 'CL:0000000',
    class_type: 'CellType',
    ccf_pref_label: 'cell type',
    ccf_asctb_type: 'CT',
    ccf_is_provisional: false,
    ccf_designated_parent: 'ccf:CellType'
  }];
  return patches;
}

export function getPatchesForBiomarker() {
  const patches = [{
    id: 'HGNCO:gene',
    class_type: 'Biomarker',
    ccf_pref_label: 'gene',
    ccf_asctb_type: 'BM',
    ccf_is_provisional: false,
    ccf_biomarker_type: 'gene',
    ccf_designated_parent: 'ccf:Biomarker'
  }];
  return patches;
}

export function normalizeDoi(doi) {
  let normDoi = doi.replace(/\s+/g, '');
  if (/^10\.\d+\/.*/.test(normDoi)) {
    normDoi = normDoi.replace(/^(10\.\d+\/.*)/, 'https://doi.org/$1');
  } else {
    normDoi = normDoi.replace(/^(DOI|doi):|^(https?:\/\/)?doi\.org\//, 'https://doi.org/');
  }
  return normDoi;
}

export function isIdValid(id) {
  return /(UBERON|FMA|CL|PCL|LMHA|HGNC):\d+|ASCTB-TEMP:[a-zA-Z0-9\-]+/.test(id);
}

export function isCtIdValid(id) {
  return /(CL|PCL|LMHA):\d+|ASCTB-TEMP:[a-zA-Z0-9\-]+/.test(id);
}

export function isDoiValid(doi) {
  const doiString = doi.replace(/\s+/g, '');
  return /^https:\/\/doi\.org\/10\.\d+\/.*/.test(doiString);
}

