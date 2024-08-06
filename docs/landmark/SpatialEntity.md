
# Class: SpatialEntity



URI: [ccf:SpatialEntity](http://purl.org/ccf/SpatialEntity)


[![img](images/SpatialEntity.svg)](images/SpatialEntity.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[reference_organ](reference_organ.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[source](source.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[spatial_entities](spatial_entities.md)*  <sub>1..\*</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[target](target.md)*  <sub>1..1</sub>  **[SpatialEntity](SpatialEntity.md)**

## Attributes


### Own

 * [pref_label](pref_label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [creators](creators.md)  <sub>0..\*</sub>
     * Range: [Creator](Creator.md)
 * [x_dimension](x_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_dimension](y_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_dimension](z_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [SpatialEntity➞dimension_unit](SpatialEntity_dimension_unit.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [object_reference](object_reference.md)  <sub>0..1</sub>
     * Range: [SpatialObjectReference](SpatialObjectReference.md)
 * [placements](placements.md)  <sub>0..\*</sub>
     * Range: [SpatialPlacement](SpatialPlacement.md)
 * [extraction_set](extraction_set.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
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
| **Mappings:** | | ccf:SpatialEntity |