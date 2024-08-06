
# Class: SpatialEntity



URI: [ccf:SpatialEntity](http://purl.org/ccf/SpatialEntity)


[![img](images/SpatialEntity.svg)](images/SpatialEntity.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[extraction_site](extraction_site.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[rui_location](rui_location.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[source](source.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[spatial_entity](spatial_entity.md)*  <sub>0..\*</sub>  **[SpatialEntity](SpatialEntity.md)**

## Attributes


### Own

 * [pref_label](pref_label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [creator_name](creator_name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [create_date](create_date.md)  <sub>0..1</sub>
     * Range: [Date](types/Date.md)
 * [x_dimension](x_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_dimension](y_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_dimension](z_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [SpatialEntity➞dimension_unit](SpatialEntity_dimension_unit.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [collides_with](collides_with.md)  <sub>0..\*</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [slice_count](slice_count.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)
 * [slice_thickness](slice_thickness.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)
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
| **Mappings:** | | ccf:SpatialEntity |