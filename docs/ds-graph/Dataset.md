
# Class: Dataset



URI: [ccf:Dataset](http://purl.org/ccf/Dataset)


[![img](images/Dataset.svg)](images/Dataset.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[dataset](dataset.md)*  <sub>0..\*</sub>  **[Dataset](Dataset.md)**
 *  **None** *[datasets](datasets.md)*  <sub>0..\*</sub>  **[Dataset](Dataset.md)**
 *  **None** *[was_derived_from](was_derived_from.md)*  <sub>0..1</sub>  **[Dataset](Dataset.md)**

## Attributes


### Own

 * [pref_label](pref_label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [description](description.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [external_link](external_link.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [technology](technology.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [thumbnail](thumbnail.md)  <sub>1..1</sub>
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
| **Mappings:** | | ccf:Dataset |