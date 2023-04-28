
# asct-b


**metamodel version:** 1.7.0

**version:** None





### Classes

 * [AsctbConcept](AsctbConcept.md)
     * [AnatomicalStructure](AnatomicalStructure.md)
     * [Biomarker](Biomarker.md)
     * [CellType](CellType.md)
 * [AsctbDataset](AsctbDataset.md)
 * [AsctbMetadata](AsctbMetadata.md)
 * [BiomarkerSet](BiomarkerSet.md)
 * [Container](Container.md)
 * [Grant](Grant.md)
 * [Person](Person.md)

### Mixins


### Slots

 * [anatomical_structures](anatomical_structures.md)
 * [awardNumber](awardNumber.md)
 * [biomarkers](biomarkers.md)
 * [ccf_asctb_type](ccf_asctb_type.md)
     * [AsctbConcept➞ccf_asctb_type](AsctbConcept_ccf_asctb_type.md)
 * [ccf_biomarker_type](ccf_biomarker_type.md)
     * [Biomarker➞ccf_biomarker_type](Biomarker_ccf_biomarker_type.md)
 * [ccf_ct_isa](ccf_ct_isa.md)
     * [CellType➞ccf_ct_isa](CellType_ccf_ct_isa.md)
 * [ccf_has_biomarker_set](ccf_has_biomarker_set.md)
     * [CellType➞ccf_has_biomarker_set](CellType_ccf_has_biomarker_set.md)
 * [ccf_is_provisional](ccf_is_provisional.md)
     * [AsctbConcept➞ccf_is_provisional](AsctbConcept_ccf_is_provisional.md)
 * [ccf_located_in](ccf_located_in.md)
     * [CellType➞ccf_located_in](CellType_ccf_located_in.md)
 * [ccf_part_of](ccf_part_of.md)
     * [AnatomicalStructure➞ccf_part_of](AnatomicalStructure_ccf_part_of.md)
 * [ccf_pref_label](ccf_pref_label.md)
     * [AsctbConcept➞ccf_pref_label](AsctbConcept_ccf_pref_label.md)
 * [cell_types](cell_types.md)
 * [citation](citation.md)
 * [citationOverall](citationOverall.md)
 * [class_type](class_type.md)
 * [➞data](container__data.md)
 * [➞id](container__id.md)
 * [➞metadata](container__metadata.md)
 * [creation_date](creation_date.md)
 * [creators](creators.md)
 * [datatable](datatable.md)
 * [description](description.md)
 * [doi](doi.md)
 * [externalReviewers](externalReviewers.md)
 * [firstName](firstName.md)
 * [fullName](fullName.md)
 * [funder](funder.md)
 * [funders](funders.md)
 * [hubmapId](hubmapId.md)
 * [id](id.md)
 * [lastName](lastName.md)
 * [license](license.md)
 * [members](members.md)
 * [name](name.md)
 * [orcid](orcid.md)
 * [project_leads](project_leads.md)
 * [publisher](publisher.md)
 * [references](references.md)
 * [reviewers](reviewers.md)
 * [title](title.md)
 * [type](type.md)
 * [version](version.md)

### Enums


### Subsets


### Types


#### Built in

 * **Bool**
 * **Curie**
 * **Decimal**
 * **ElementIdentifier**
 * **NCName**
 * **NodeIdentifier**
 * **URI**
 * **URIorCURIE**
 * **XSDDate**
 * **XSDDateTime**
 * **XSDTime**
 * **float**
 * **int**
 * **str**

#### Defined

 * [Boolean](types/Boolean.md)  (**Bool**)  - A binary (true or false) value
 * [Curie](types/Curie.md)  (**Curie**)  - a compact URI
 * [Date](types/Date.md)  (**XSDDate**)  - a date (year, month and day) in an idealized calendar
 * [DateOrDatetime](types/DateOrDatetime.md)  (**str**)  - Either a date or a datetime
 * [Datetime](types/Datetime.md)  (**XSDDateTime**)  - The combination of a date and time
 * [Decimal](types/Decimal.md)  (**Decimal**)  - A real number with arbitrary precision that conforms to the xsd:decimal specification
 * [Double](types/Double.md)  (**float**)  - A real number that conforms to the xsd:double specification
 * [Float](types/Float.md)  (**float**)  - A real number that conforms to the xsd:float specification
 * [Integer](types/Integer.md)  (**int**)  - An integer
 * [Ncname](types/Ncname.md)  (**NCName**)  - Prefix part of CURIE
 * [Nodeidentifier](types/Nodeidentifier.md)  (**NodeIdentifier**)  - A URI, CURIE or BNODE that represents a node in a model.
 * [Objectidentifier](types/Objectidentifier.md)  (**ElementIdentifier**)  - A URI or CURIE that represents an object in the model.
 * [String](types/String.md)  (**str**)  - A character string
 * [Time](types/Time.md)  (**XSDTime**)  - A time object represents a (local) time of day, independent of any particular day
 * [Uri](types/Uri.md)  (**URI**)  - a complete URI
 * [Uriorcurie](types/Uriorcurie.md)  (**URIorCURIE**)  - a URI or a CURIE
