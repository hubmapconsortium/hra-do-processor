
# Class: SpatialObjectReference



URI: [ccf:SpatialObjectReference](http://purl.org/ccf/SpatialObjectReference)


[![img](images/SpatialObjectReference.svg)](images/SpatialObjectReference.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[object_reference](object_reference.md)*  <sub>0..1</sub>  **[SpatialObjectReference](SpatialObjectReference.md)**

## Attributes


### Own

 * [file_name](file_name.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [file_url](file_url.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [file_subpath](file_subpath.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [file_format](file_format.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [placement](placement.md)  <sub>1..1</sub>
     * Range: [SpatialPlacement](SpatialPlacement.md)

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
| **Mappings:** | | ccf:SpatialObjectReference |