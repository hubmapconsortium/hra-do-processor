
# Class: ExtractionSet




URI: [ccf:ExtractionSet](http://purl.org/ccf/ExtractionSet)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[LandmarkData]++-%20landmarks%201..*>[ExtractionSet&#124;id:string;pref_label:string;extraction_set_for:uriorcurie;rui_rank:integer%20%3F;label:string;class_type:string%20%3F],[ExtractionSet]uses%20-.->[Named],[ExtractionSet]uses%20-.->[Instance],[LandmarkData])](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[LandmarkData]++-%20landmarks%201..*>[ExtractionSet&#124;id:string;pref_label:string;extraction_set_for:uriorcurie;rui_rank:integer%20%3F;label:string;class_type:string%20%3F],[ExtractionSet]uses%20-.->[Named],[ExtractionSet]uses%20-.->[Instance],[LandmarkData])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[landmarks](landmarks.md)*  <sub>1..\*</sub>  **[ExtractionSet](ExtractionSet.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [pref_label](pref_label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [extraction_set_for](extraction_set_for.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [rui_rank](rui_rank.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)

### Mixed in from Named:

 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [class_type](class_type.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [typeOf](typeOf.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:ExtractionSet |

