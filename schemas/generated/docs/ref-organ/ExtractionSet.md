
# Class: ExtractionSet




URI: [ccf:ExtractionSet](http://purl.org/ccf/ExtractionSet)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity],[Named],[Instance],[SpatialEntity]<extraction_set_for%201..1-%20[ExtractionSet&#124;id:string;label:string;rui_rank:integer%20%3F;class_type:string%20%3F],[SpatialEntity]-%20extraction_set%200..1>[ExtractionSet],[ExtractionSet]uses%20-.->[Named],[ExtractionSet]uses%20-.->[Instance])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity],[Named],[Instance],[SpatialEntity]<extraction_set_for%201..1-%20[ExtractionSet&#124;id:string;label:string;rui_rank:integer%20%3F;class_type:string%20%3F],[SpatialEntity]-%20extraction_set%200..1>[ExtractionSet],[ExtractionSet]uses%20-.->[Named],[ExtractionSet]uses%20-.->[Instance])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[extraction_set](extraction_set.md)*  <sub>0..1</sub>  **[ExtractionSet](ExtractionSet.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [extraction_set_for](extraction_set_for.md)  <sub>1..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [rui_rank](rui_rank.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)

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

