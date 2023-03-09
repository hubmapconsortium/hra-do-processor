
# Class: AsctbRecord




URI: [ccf:AsctbRecord](http://purl.org/ccf/AsctbRecord)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[StudyReference],[ProteinBiomarker],[ProtBiomarker],[MetaBiomarker],[LipidBiomarker],[GeneBiomarker],[FtuType],[CellType],[Biomarker],[StudyReference]<references%200..*-++[AsctbRecord],[FtuType]<ftu_types%200..*-++[AsctbRecord],[ProtBiomarker]<biomarkers_prot%200..*-++[AsctbRecord],[MetaBiomarker]<biomarkers_meta%200..*-++[AsctbRecord],[LipidBiomarker]<biomarkers_lipids%200..*-++[AsctbRecord],[GeneBiomarker]<biomarkers_gene%200..*-++[AsctbRecord],[ProteinBiomarker]<biomarkers_protein%200..*-++[AsctbRecord],[Biomarker]<biomarkers%200..*-++[AsctbRecord],[CellType]<cell_types%200..*-++[AsctbRecord],[AnatomicalStructure]<anatomical_structures%201..*-++[AsctbRecord],[Container]++-%20data%200..*>[AsctbRecord],[Container],[AnatomicalStructure])](https://yuml.me/diagram/nofunky;dir:TB/class/[StudyReference],[ProteinBiomarker],[ProtBiomarker],[MetaBiomarker],[LipidBiomarker],[GeneBiomarker],[FtuType],[CellType],[Biomarker],[StudyReference]<references%200..*-++[AsctbRecord],[FtuType]<ftu_types%200..*-++[AsctbRecord],[ProtBiomarker]<biomarkers_prot%200..*-++[AsctbRecord],[MetaBiomarker]<biomarkers_meta%200..*-++[AsctbRecord],[LipidBiomarker]<biomarkers_lipids%200..*-++[AsctbRecord],[GeneBiomarker]<biomarkers_gene%200..*-++[AsctbRecord],[ProteinBiomarker]<biomarkers_protein%200..*-++[AsctbRecord],[Biomarker]<biomarkers%200..*-++[AsctbRecord],[CellType]<cell_types%200..*-++[AsctbRecord],[AnatomicalStructure]<anatomical_structures%201..*-++[AsctbRecord],[Container]++-%20data%200..*>[AsctbRecord],[Container],[AnatomicalStructure])

## Referenced by Class

 *  **None** *[➞data](container__data.md)*  <sub>0..\*</sub>  **[AsctbRecord](AsctbRecord.md)**

## Attributes


### Own

 * [anatomical_structures](anatomical_structures.md)  <sub>1..\*</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)
 * [cell_types](cell_types.md)  <sub>0..\*</sub>
     * Range: [CellType](CellType.md)
 * [biomarkers](biomarkers.md)  <sub>0..\*</sub>
     * Range: [Biomarker](Biomarker.md)
 * [biomarkers_protein](biomarkers_protein.md)  <sub>0..\*</sub>
     * Range: [ProteinBiomarker](ProteinBiomarker.md)
 * [biomarkers_gene](biomarkers_gene.md)  <sub>0..\*</sub>
     * Range: [GeneBiomarker](GeneBiomarker.md)
 * [biomarkers_lipids](biomarkers_lipids.md)  <sub>0..\*</sub>
     * Range: [LipidBiomarker](LipidBiomarker.md)
 * [biomarkers_meta](biomarkers_meta.md)  <sub>0..\*</sub>
     * Range: [MetaBiomarker](MetaBiomarker.md)
 * [biomarkers_prot](biomarkers_prot.md)  <sub>0..\*</sub>
     * Range: [ProtBiomarker](ProtBiomarker.md)
 * [ftu_types](ftu_types.md)  <sub>0..\*</sub>
     * Range: [FtuType](FtuType.md)
 * [references](references.md)  <sub>0..\*</sub>
     * Range: [StudyReference](StudyReference.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:AsctbRecord |

