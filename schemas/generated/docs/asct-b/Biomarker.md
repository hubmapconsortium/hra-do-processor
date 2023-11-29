
# Class: Biomarker




URI: [ccf:Biomarker](http://purl.org/ccf/Biomarker)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[AsctbDataset]++-%20biomarkers%200..*>[Biomarker&#124;ccf_biomarker_type:string;id:string;class_type(i):string;ccf_pref_label(i):string;ccf_asctb_type(i):string;ccf_is_provisional(i):boolean;ccf_designated_parent(i):string%20%3F],[BiomarkerSet]-%20members%200..*>[Biomarker],[AsctbConcept]^-[Biomarker],[BiomarkerSet],[AsctbDataset],[AsctbConcept])](https://yuml.me/diagram/nofunky;dir:TB/class/[AsctbDataset]++-%20biomarkers%200..*>[Biomarker&#124;ccf_biomarker_type:string;id:string;class_type(i):string;ccf_pref_label(i):string;ccf_asctb_type(i):string;ccf_is_provisional(i):boolean;ccf_designated_parent(i):string%20%3F],[BiomarkerSet]-%20members%200..*>[Biomarker],[AsctbConcept]^-[Biomarker],[BiomarkerSet],[AsctbDataset],[AsctbConcept])

## Parents

 *  is_a: [AsctbConcept](AsctbConcept.md)

## Referenced by Class

 *  **None** *[biomarkers](biomarkers.md)*  <sub>0..\*</sub>  **[Biomarker](Biomarker.md)**
 *  **None** *[members](members.md)*  <sub>0..\*</sub>  **[Biomarker](Biomarker.md)**

## Attributes


### Own

 * [Biomarker➞ccf_biomarker_type](Biomarker_ccf_biomarker_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Biomarker➞id](Biomarker_id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Inherited from AsctbConcept:

 * [class_type](class_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_pref_label](AsctbConcept_ccf_pref_label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_asctb_type](AsctbConcept_ccf_asctb_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [AsctbConcept➞ccf_is_provisional](AsctbConcept_ccf_is_provisional.md)  <sub>1..1</sub>
     * Range: [Boolean](types/Boolean.md)
 * [ccf_designated_parent](ccf_designated_parent.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
