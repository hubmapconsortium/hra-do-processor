
# Class: SpatialEntity




URI: [ccf:SpatialEntity](http://purl.org/ccf/SpatialEntity)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialObjectReference],[SpatialPlacement]<placements%200..*-++[SpatialEntity&#124;id:string;pref_label:string;x_dimension:float;y_dimension:float;z_dimension:float;dimension_unit:DimensionUnitEnum;extraction_set:uriorcurie;rui_rank:integer%20%3F;label:string;class_type:string%20%3F],[SpatialObjectReference]<object_reference%200..1-++[SpatialEntity],[Creator]<creator%201..*-++[SpatialEntity],[LandmarkData]++-%20spatial_entities%201..*>[SpatialEntity],[SpatialPlacement]-%20target%201..1>[SpatialEntity],[SpatialEntity]uses%20-.->[Named],[SpatialEntity]uses%20-.->[Instance],[Named],[LandmarkData],[Instance],[Creator])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialObjectReference],[SpatialPlacement]<placements%200..*-++[SpatialEntity&#124;id:string;pref_label:string;x_dimension:float;y_dimension:float;z_dimension:float;dimension_unit:DimensionUnitEnum;extraction_set:uriorcurie;rui_rank:integer%20%3F;label:string;class_type:string%20%3F],[SpatialObjectReference]<object_reference%200..1-++[SpatialEntity],[Creator]<creator%201..*-++[SpatialEntity],[LandmarkData]++-%20spatial_entities%201..*>[SpatialEntity],[SpatialPlacement]-%20target%201..1>[SpatialEntity],[SpatialEntity]uses%20-.->[Named],[SpatialEntity]uses%20-.->[Instance],[Named],[LandmarkData],[Instance],[Creator])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[reference_organ](reference_organ.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[spatial_entities](spatial_entities.md)*  <sub>1..\*</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[target](target.md)*  <sub>1..1</sub>  **[SpatialEntity](SpatialEntity.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [pref_label](pref_label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [creator](creator.md)  <sub>1..\*</sub>
     * Range: [Creator](Creator.md)
 * [x_dimension](x_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_dimension](y_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_dimension](z_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [dimension_unit](dimension_unit.md)  <sub>1..1</sub>
     * Range: [DimensionUnitEnum](DimensionUnitEnum.md)
 * [object_reference](object_reference.md)  <sub>0..1</sub>
     * Range: [SpatialObjectReference](SpatialObjectReference.md)
 * [placements](placements.md)  <sub>0..\*</sub>
     * Range: [SpatialPlacement](SpatialPlacement.md)
 * [extraction_set](extraction_set.md)  <sub>1..1</sub>
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
| **Mappings:** | | ccf:SpatialEntity |

