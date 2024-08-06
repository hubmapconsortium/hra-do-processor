
# Class: SpatialPlacement



URI: [ccf:SpatialPlacement](http://purl.org/ccf/SpatialPlacement)


[![img](images/SpatialPlacement.svg)](images/SpatialPlacement.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[placement](placement.md)*  <sub>1..1</sub>  **[SpatialPlacement](SpatialPlacement.md)**
 *  **None** *[placements](placements.md)*  <sub>0..\*</sub>  **[SpatialPlacement](SpatialPlacement.md)**

## Attributes


### Own

 * [target](target.md)  <sub>1..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [source](source.md)  <sub>0..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [placement_date](placement_date.md)  <sub>1..1</sub>
     * Range: [Date](types/Date.md)
 * [x_scaling](x_scaling.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_scaling](y_scaling.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_scaling](z_scaling.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [SpatialPlacement➞scaling_unit](SpatialPlacement_scaling_unit.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [x_rotation](x_rotation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_rotation](y_rotation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_rotation](z_rotation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [SpatialPlacement➞rotation_unit](SpatialPlacement_rotation_unit.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [SpatialPlacement➞rotation_order](SpatialPlacement_rotation_order.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [x_translation](x_translation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_translation](y_translation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_translation](z_translation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [SpatialPlacement➞translation_unit](SpatialPlacement_translation_unit.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

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
| **Mappings:** | | ccf:SpatialPlacement |