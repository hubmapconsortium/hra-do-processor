
# Class: SpatialObjectReference




URI: [ccf:SpatialObjectReference](http://purl.org/ccf/SpatialObjectReference)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialPlacement]<placement%201..1-++[SpatialObjectReference&#124;id:string;file:string;file_subpath:string%20%3F;file_format:string;label:string;class_type:string%20%3F],[SpatialEntity]++-%20object_reference%200..1>[SpatialObjectReference],[SpatialObjectReference]uses%20-.->[Named],[SpatialObjectReference]uses%20-.->[Instance],[SpatialEntity],[Named],[Instance])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialPlacement]<placement%201..1-++[SpatialObjectReference&#124;id:string;file:string;file_subpath:string%20%3F;file_format:string;label:string;class_type:string%20%3F],[SpatialEntity]++-%20object_reference%200..1>[SpatialObjectReference],[SpatialObjectReference]uses%20-.->[Named],[SpatialObjectReference]uses%20-.->[Instance],[SpatialEntity],[Named],[Instance])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[object_reference](object_reference.md)*  <sub>0..1</sub>  **[SpatialObjectReference](SpatialObjectReference.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [file](file.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [file_subpath](file_subpath.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [file_format](file_format.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [placement](placement.md)  <sub>1..1</sub>
     * Range: [SpatialPlacement](SpatialPlacement.md)

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
| **Mappings:** | | ccf:SpatialObjectReference |

