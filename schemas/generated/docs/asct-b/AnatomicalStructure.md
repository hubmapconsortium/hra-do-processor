
# Class: AnatomicalStructure




URI: [ccf:AnatomicalStructure](http://purl.org/ccf/AnatomicalStructure)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[CellType],[AsctbConcept],[AnatomicalStructure]<ccf_part_of%200..*-%20[AnatomicalStructure&#124;id(i):uriorcurie;class_type(i):string;ccf_pref_label(i):string;ccf_asctb_type(i):string;ccf_is_provisional(i):boolean],[CellType]-%20ccf_located_in%200..*>[AnatomicalStructure],[AsctbDataset]++-%20anatomical_structures%200..*>[AnatomicalStructure],[CellType]-%20ccf_located_in(i)%200..*>[AnatomicalStructure],[AsctbConcept]^-[AnatomicalStructure],[AsctbDataset])](https://yuml.me/diagram/nofunky;dir:TB/class/[CellType],[AsctbConcept],[AnatomicalStructure]<ccf_part_of%200..*-%20[AnatomicalStructure&#124;id(i):uriorcurie;class_type(i):string;ccf_pref_label(i):string;ccf_asctb_type(i):string;ccf_is_provisional(i):boolean],[CellType]-%20ccf_located_in%200..*>[AnatomicalStructure],[AsctbDataset]++-%20anatomical_structures%200..*>[AnatomicalStructure],[CellType]-%20ccf_located_in(i)%200..*>[AnatomicalStructure],[AsctbConcept]^-[AnatomicalStructure],[AsctbDataset])

## Parents

 *  is_a: [AsctbConcept](AsctbConcept.md)

## Referenced by Class

 *  **[AnatomicalStructure](AnatomicalStructure.md)** *[AnatomicalStructure➞ccf_part_of](AnatomicalStructure_ccf_part_of.md)*  <sub>0..\*</sub>  **[AnatomicalStructure](AnatomicalStructure.md)**
 *  **[CellType](CellType.md)** *[CellType➞ccf_located_in](CellType_ccf_located_in.md)*  <sub>0..\*</sub>  **[AnatomicalStructure](AnatomicalStructure.md)**
 *  **None** *[anatomical_structures](anatomical_structures.md)*  <sub>0..\*</sub>  **[AnatomicalStructure](AnatomicalStructure.md)**
 *  **None** *[ccf_located_in](ccf_located_in.md)*  <sub>0..\*</sub>  **[AnatomicalStructure](AnatomicalStructure.md)**
 *  **None** *[ccf_part_of](ccf_part_of.md)*  <sub>0..\*</sub>  **[AnatomicalStructure](AnatomicalStructure.md)**

## Attributes


### Own

 * [AnatomicalStructure➞ccf_part_of](AnatomicalStructure_ccf_part_of.md)  <sub>0..\*</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)

### Inherited from AsctbConcept:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [class_type](class_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_pref_label](AsctbConcept_ccf_pref_label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_asctb_type](AsctbConcept_ccf_asctb_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_is_provisional](AsctbConcept_ccf_is_provisional.md)  <sub>1..1</sub>
     * Range: [Boolean](types/Boolean.md)
