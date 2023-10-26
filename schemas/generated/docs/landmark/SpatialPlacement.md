
# Class: SpatialPlacement




URI: [ccf:SpatialPlacement](http://purl.org/ccf/SpatialPlacement)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity]<target%201..1-%20[SpatialPlacement&#124;id:string;x_scaling:float;y_scaling:float;z_scaling:float;scaling_unit:ScalingUnitEnum;x_rotation:float;y_rotation:float;z_rotation:float;rotation_unit:RotationUnitEnum;rotation_order:string%20%3F;x_translation:float;y_translation:float;z_translation:float;translation_unit:TranslationUnitEnum;label:string;class_type:string%20%3F],[SpatialObjectReference]++-%20placement%201..1>[SpatialPlacement],[SpatialEntity]++-%20placements%200..*>[SpatialPlacement],[SpatialPlacement]uses%20-.->[Named],[SpatialPlacement]uses%20-.->[Instance],[SpatialObjectReference],[SpatialEntity],[Named],[Instance])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity]<target%201..1-%20[SpatialPlacement&#124;id:string;x_scaling:float;y_scaling:float;z_scaling:float;scaling_unit:ScalingUnitEnum;x_rotation:float;y_rotation:float;z_rotation:float;rotation_unit:RotationUnitEnum;rotation_order:string%20%3F;x_translation:float;y_translation:float;z_translation:float;translation_unit:TranslationUnitEnum;label:string;class_type:string%20%3F],[SpatialObjectReference]++-%20placement%201..1>[SpatialPlacement],[SpatialEntity]++-%20placements%200..*>[SpatialPlacement],[SpatialPlacement]uses%20-.->[Named],[SpatialPlacement]uses%20-.->[Instance],[SpatialObjectReference],[SpatialEntity],[Named],[Instance])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[placement](placement.md)*  <sub>1..1</sub>  **[SpatialPlacement](SpatialPlacement.md)**
 *  **None** *[placements](placements.md)*  <sub>0..\*</sub>  **[SpatialPlacement](SpatialPlacement.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [target](target.md)  <sub>1..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [x_scaling](x_scaling.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_scaling](y_scaling.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_scaling](z_scaling.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [scaling_unit](scaling_unit.md)  <sub>1..1</sub>
     * Range: [ScalingUnitEnum](ScalingUnitEnum.md)
 * [x_rotation](x_rotation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_rotation](y_rotation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_rotation](z_rotation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [rotation_unit](rotation_unit.md)  <sub>1..1</sub>
     * Range: [RotationUnitEnum](RotationUnitEnum.md)
 * [rotation_order](rotation_order.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [x_translation](x_translation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_translation](y_translation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_translation](z_translation.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [translation_unit](translation_unit.md)  <sub>1..1</sub>
     * Range: [TranslationUnitEnum](TranslationUnitEnum.md)

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
| **Mappings:** | | ccf:SpatialPlacement |

