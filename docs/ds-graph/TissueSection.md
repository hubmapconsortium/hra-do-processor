
# Class: TissueSection



URI: [ccf:TissueSection](http://purl.org/ccf/TissueSection)


[![img](images/TissueSection.svg)](images/TissueSection.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[sections](sections.md)*  <sub>0..\*</sub>  **[TissueSection](TissueSection.md)**

## Attributes


### Own

 * [pref_label](pref_label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [description](description.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [external_link](external_link.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [samples](samples.md)  <sub>0..\*</sub>
     * Range: [TissueBlock](TissueBlock.md)
 * [datasets](datasets.md)  <sub>0..\*</sub>
     * Range: [Dataset](Dataset.md)
 * [section_number](section_number.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)
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
| **Mappings:** | | ccf:TissueSection |