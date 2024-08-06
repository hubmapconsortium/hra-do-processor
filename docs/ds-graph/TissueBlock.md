
# Class: TissueBlock



URI: [ccf:TissueBlock](http://purl.org/ccf/TissueBlock)


[![img](images/TissueBlock.svg)](images/TissueBlock.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[sample](sample.md)*  <sub>0..\*</sub>  **[TissueBlock](TissueBlock.md)**
 *  **None** *[samples](samples.md)*  <sub>0..\*</sub>  **[TissueBlock](TissueBlock.md)**

## Attributes


### Own

 * [TissueBlock➞partially_overlaps](TissueBlock_partially_overlaps.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)
 * [pref_label](pref_label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [description](description.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [rui_location](rui_location.md)  <sub>0..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [extraction_site](extraction_site.md)  <sub>0..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [external_link](external_link.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [sections](sections.md)  <sub>0..\*</sub>
     * Range: [TissueSection](TissueSection.md)
 * [datasets](datasets.md)  <sub>0..\*</sub>
     * Range: [ExperimentalDataset](ExperimentalDataset.md)
 * [section_count](section_count.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)
 * [section_size](section_size.md)  <sub>0..1</sub>
     * Range: [Float](types/Float.md)
 * [section_size_unit](section_size_unit.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [links_back_to](links_back_to.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Mixed in from Named:

 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [type_of](type_of.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:TissueBlock |