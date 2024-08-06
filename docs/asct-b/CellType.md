
# Class: CellType



URI: [ccf:CellType](http://purl.org/ccf/CellType)


[![img](images/CellType.svg)](images/CellType.svg)

## Parents

 *  is_a: [AsctbConcept](AsctbConcept.md)

## Referenced by Class

 *  **[CellType](CellType.md)** *[CellType➞ccf_ct_isa](CellType_ccf_ct_isa.md)*  <sub>0..\*</sub>  **[CellType](CellType.md)**
 *  **None** *[ccf_ct_isa](ccf_ct_isa.md)*  <sub>0..\*</sub>  **[CellType](CellType.md)**
 *  **None** *[cell_types](cell_types.md)*  <sub>0..\*</sub>  **[CellType](CellType.md)**

## Attributes


### Own

 * [CellType➞ccf_ct_isa](CellType_ccf_ct_isa.md)  <sub>0..\*</sub>
     * Range: [CellType](CellType.md)
 * [CellType➞ccf_located_in](CellType_ccf_located_in.md)  <sub>0..\*</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)
 * [CellType➞ccf_has_biomarker_set](CellType_ccf_has_biomarker_set.md)  <sub>0..\*</sub>
     * Range: [BiomarkerSet](BiomarkerSet.md)
 * [CellType➞id](CellType_id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Inherited from AsctbConcept:

 * [conforms_to](conforms_to.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [parent_class](parent_class.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [AsctbConcept➞ccf_pref_label](AsctbConcept_ccf_pref_label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_asctb_type](AsctbConcept_ccf_asctb_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_is_provisional](AsctbConcept_ccf_is_provisional.md)  <sub>1..1</sub>
     * Range: [Boolean](types/Boolean.md)
