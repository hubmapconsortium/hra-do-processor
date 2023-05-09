
# Class: SpatialPlacement




URI: [ccf:SpatialPlacement](http://purl.org/ccf/SpatialPlacement)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity]<source%200..1-%20[SpatialPlacement&#124;id:string;placement_date:date;x_scaling:decimal;y_scaling:decimal;z_scaling:decimal;scaling_unit:ScalingUnitEnum;x_rotation:decimal;y_rotation:decimal;z_rotation:decimal;rotation_unit:RotationUnitEnum;rotation_order:string%20%3F;x_translation:decimal;y_translation:decimal;z_translation:decimal;translation_unit:TranslationUnitEnum],[SpatialEntity]<target%201..1-%20[SpatialPlacement],[SpatialObjectReference]++-%20placement%201..1>[SpatialPlacement],[SpatialEntity]++-%20placements%200..*>[SpatialPlacement],[SpatialObjectReference],[SpatialEntity])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity]<source%200..1-%20[SpatialPlacement&#124;id:string;placement_date:date;x_scaling:decimal;y_scaling:decimal;z_scaling:decimal;scaling_unit:ScalingUnitEnum;x_rotation:decimal;y_rotation:decimal;z_rotation:decimal;rotation_unit:RotationUnitEnum;rotation_order:string%20%3F;x_translation:decimal;y_translation:decimal;z_translation:decimal;translation_unit:TranslationUnitEnum],[SpatialEntity]<target%201..1-%20[SpatialPlacement],[SpatialObjectReference]++-%20placement%201..1>[SpatialPlacement],[SpatialEntity]++-%20placements%200..*>[SpatialPlacement],[SpatialObjectReference],[SpatialEntity])

## Referenced by Class

 *  **None** *[placement](placement.md)*  <sub>1..1</sub>  **[SpatialPlacement](SpatialPlacement.md)**
 *  **None** *[placements](placements.md)*  <sub>0..\*</sub>  **[SpatialPlacement](SpatialPlacement.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [target](target.md)  <sub>1..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [source](source.md)  <sub>0..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [placement_date](placement_date.md)  <sub>1..1</sub>
     * Range: [Date](types/Date.md)
 * [x_scaling](x_scaling.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [y_scaling](y_scaling.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [z_scaling](z_scaling.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [scaling_unit](scaling_unit.md)  <sub>1..1</sub>
     * Range: [ScalingUnitEnum](ScalingUnitEnum.md)
 * [x_rotation](x_rotation.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [y_rotation](y_rotation.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [z_rotation](z_rotation.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [rotation_unit](rotation_unit.md)  <sub>1..1</sub>
     * Range: [RotationUnitEnum](RotationUnitEnum.md)
 * [rotation_order](rotation_order.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [x_translation](x_translation.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [y_translation](y_translation.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [z_translation](z_translation.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [translation_unit](translation_unit.md)  <sub>1..1</sub>
     * Range: [TranslationUnitEnum](TranslationUnitEnum.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:SpatialPlacement |

