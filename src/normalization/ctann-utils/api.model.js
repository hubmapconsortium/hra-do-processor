export const DELIMETER = ',';
export const TITLE_ROW_INDEX = 0;

export const multiValueMetadataFields = [
  'Author Name(s):',
  'Author ORCID(s):',
  'Reviewer(s):',
  'Reviewer ORCID(s):',
  'General Publication(s):'
];

export const metadataFieldMap = {
  'Author Name(s):': 'author_names',
  'Author ORCID(s):': 'author_orcids',
  'Reviewer(s):': 'reviewer_names',
  'Reviewer ORCID(s):': 'reviewer_orcids',
  'General Publication(s):': 'general_publications',
  'Data DOI:': 'data_doi',
  'Date:': 'date',
  'Version number:': 'version',
};

const dataColumnMap = {
  "Organ_Level": "organ_level",
  "Organ_ID": "organ_id",
  "Annotation_Label": "annotation_label",
  "Annotation_Label_ID": "annotation_id",
  "CL_Label": "cl_label",
  "CL_ID": "cl_id",
  "CL_Match": "match_category",
}

export const CTANN_HEADER_FIRST_COLUMN = 'Organ_Level';

export class Row {
  constructor(rowNumber, recordNumber) {
    this.rowNumber = rowNumber;
    this.recordNumber = recordNumber;
  }

  set(columnName, value) {
    const key = dataColumnMap[columnName];
    if (key) {
      this[key] = value.trim();
    }
  }
}
