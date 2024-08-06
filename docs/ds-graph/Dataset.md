
# Class: Dataset



URI: [ccf:Dataset](http://purl.org/ccf/Dataset)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[DatasetGraphData]++-%20dataset%200..*>[Dataset&#124;pref_label:string%20%3F;description:string%20%3F;external_link:string%20%3F;technology:string%20%3F;thumbnail:string;links_back_to:uriorcurie%20%3F;id:uriorcurie;label:string],[TissueBlock]-%20datasets%200..*>[Dataset],[TissueSection]-%20datasets%200..*>[Dataset],[ProvEntity]++-%20was_derived_from%200..1>[Dataset],[Dataset]uses%20-.->[Named],[Dataset]uses%20-.->[Instance],[TissueSection],[TissueBlock],[ProvEntity],[DatasetGraphData])](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[DatasetGraphData]++-%20dataset%200..*>[Dataset&#124;pref_label:string%20%3F;description:string%20%3F;external_link:string%20%3F;technology:string%20%3F;thumbnail:string;links_back_to:uriorcurie%20%3F;id:uriorcurie;label:string],[TissueBlock]-%20datasets%200..*>[Dataset],[TissueSection]-%20datasets%200..*>[Dataset],[ProvEntity]++-%20was_derived_from%200..1>[Dataset],[Dataset]uses%20-.->[Named],[Dataset]uses%20-.->[Instance],[TissueSection],[TissueBlock],[ProvEntity],[DatasetGraphData])

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