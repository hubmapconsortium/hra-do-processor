
# Class: AsctbDataset




URI: [ccf:AsctbDataset](http://purl.org/ccf/AsctbDataset)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[CellType],[Biomarker],[Biomarker]<biomarkers%200..*-++[AsctbDataset],[CellType]<cell_types%200..*-++[AsctbDataset],[AnatomicalStructure]<anatomical_structures%200..*-++[AsctbDataset],[Container]++-%20data%200..1>[AsctbDataset],[Container],[AnatomicalStructure])](https://yuml.me/diagram/nofunky;dir:TB/class/[CellType],[Biomarker],[Biomarker]<biomarkers%200..*-++[AsctbDataset],[CellType]<cell_types%200..*-++[AsctbDataset],[AnatomicalStructure]<anatomical_structures%200..*-++[AsctbDataset],[Container]++-%20data%200..1>[AsctbDataset],[Container],[AnatomicalStructure])

## Referenced by Class

 *  **None** *[➞data](container__data.md)*  <sub>0..1</sub>  **[AsctbDataset](AsctbDataset.md)**

## Attributes


### Own

 * [anatomical_structures](anatomical_structures.md)  <sub>0..\*</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)
 * [cell_types](cell_types.md)  <sub>0..\*</sub>
     * Range: [CellType](CellType.md)
 * [biomarkers](biomarkers.md)  <sub>0..\*</sub>
     * Range: [Biomarker](Biomarker.md)
