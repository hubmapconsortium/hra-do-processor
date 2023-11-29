
# Class: SpatialEntity




URI: [ccf:SpatialEntity](http://purl.org/ccf/SpatialEntity)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialObjectReference],[ExtractionSet]<extraction_set%200..1-%20[SpatialEntity&#124;id:string;label:string;pref_label:string;create_date:date;x_dimension:float;y_dimension:float;z_dimension:float;dimension_unit:DimensionUnitEnum;organ_owner_sex:DonorSexEnum%20%3F;organ_side:OrganSideEnum%20%3F;rui_rank:integer%20%3F;class_type:string%20%3F],[SpatialEntity]<reference_organ%200..1-%20[SpatialEntity],[SpatialPlacement]<placements%200..*-++[SpatialEntity],[SpatialObjectReference]<object_reference%200..1-++[SpatialEntity],[AnatomicalStructure]<representation_of%200..1-%20[SpatialEntity],[Creator]<creator%201..*-++[SpatialEntity],[Container]++-%20data%200..*>[SpatialEntity],[ExtractionSet]-%20extraction_set_for%201..1>[SpatialEntity],[SpatialPlacement]-%20source%200..1>[SpatialEntity],[SpatialPlacement]-%20target%201..1>[SpatialEntity],[SpatialEntity]uses%20-.->[Named],[SpatialEntity]uses%20-.->[Instance],[Named],[Instance],[ExtractionSet],[Creator],[Container],[AnatomicalStructure])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialObjectReference],[ExtractionSet]<extraction_set%200..1-%20[SpatialEntity&#124;id:string;label:string;pref_label:string;create_date:date;x_dimension:float;y_dimension:float;z_dimension:float;dimension_unit:DimensionUnitEnum;organ_owner_sex:DonorSexEnum%20%3F;organ_side:OrganSideEnum%20%3F;rui_rank:integer%20%3F;class_type:string%20%3F],[SpatialEntity]<reference_organ%200..1-%20[SpatialEntity],[SpatialPlacement]<placements%200..*-++[SpatialEntity],[SpatialObjectReference]<object_reference%200..1-++[SpatialEntity],[AnatomicalStructure]<representation_of%200..1-%20[SpatialEntity],[Creator]<creator%201..*-++[SpatialEntity],[Container]++-%20data%200..*>[SpatialEntity],[ExtractionSet]-%20extraction_set_for%201..1>[SpatialEntity],[SpatialPlacement]-%20source%200..1>[SpatialEntity],[SpatialPlacement]-%20target%201..1>[SpatialEntity],[SpatialEntity]uses%20-.->[Named],[SpatialEntity]uses%20-.->[Instance],[Named],[Instance],[ExtractionSet],[Creator],[Container],[AnatomicalStructure])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[➞data](container__data.md)*  <sub>0..\*</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[extraction_set_for](extraction_set_for.md)*  <sub>1..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[reference_organ](reference_organ.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[source](source.md)*  <sub>0..1</sub>  **[SpatialEntity](SpatialEntity.md)**
 *  **None** *[target](target.md)*  <sub>1..1</sub>  **[SpatialEntity](SpatialEntity.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [pref_label](pref_label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [creator](creator.md)  <sub>1..\*</sub>
     * Range: [Creator](Creator.md)
 * [create_date](create_date.md)  <sub>1..1</sub>
     * Range: [Date](types/Date.md)
 * [x_dimension](x_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [y_dimension](y_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [z_dimension](z_dimension.md)  <sub>1..1</sub>
     * Range: [Float](types/Float.md)
 * [dimension_unit](dimension_unit.md)  <sub>1..1</sub>
     * Range: [DimensionUnitEnum](DimensionUnitEnum.md)
 * [representation_of](representation_of.md)  <sub>0..1</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)
 * [organ_owner_sex](organ_owner_sex.md)  <sub>0..1</sub>
     * Range: [DonorSexEnum](DonorSexEnum.md)
 * [organ_side](organ_side.md)  <sub>0..1</sub>
     * Range: [OrganSideEnum](OrganSideEnum.md)
 * [object_reference](object_reference.md)  <sub>0..1</sub>
     * Range: [SpatialObjectReference](SpatialObjectReference.md)
 * [placements](placements.md)  <sub>0..\*</sub>
     * Range: [SpatialPlacement](SpatialPlacement.md)
 * [reference_organ](reference_organ.md)  <sub>0..1</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
 * [extraction_set](extraction_set.md)  <sub>0..1</sub>
     * Range: [ExtractionSet](ExtractionSet.md)
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
| **Mappings:** | | ccf:SpatialEntity |

