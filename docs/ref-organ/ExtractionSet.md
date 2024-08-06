
# Class: ExtractionSet



URI: [ccf:ExtractionSet](http://purl.org/ccf/ExtractionSet)


[![img](images/ExtractionSet.svg)](images/ExtractionSet.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[extraction_set](extraction_set.md)*  <sub>0..1</sub>  **[ExtractionSet](ExtractionSet.md)**

## Attributes


### Own

 * [extraction_set_for](extraction_set_for.md)  <sub>1..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [rui_rank](rui_rank.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)

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
| **Mappings:** | | ccf:ExtractionSet |