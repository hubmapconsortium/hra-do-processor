
# Class: SpatialEntity




URI: [ccf:SpatialEntity](http://purl.org/ccf/SpatialEntity)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialObjectReference],[ExtractionSet]<extraction_set%200..1-%20[SpatialEntity&#124;id:string;label:string;creator:string;creator_first_name:string;creator_last_name:string;creator_orcid:string%20%3F;creation_date:date;x_dimension:decimal;y_dimension:decimal;z_dimension:decimal;dimension_unit:DimensionUnitEnum;organ_donor_sex:DonorSexEnum%20%3F;organ_side:OrganSideEnum%20%3F;rui_rank:integer%20%3F],[SpatialEntity]<reference_organ%200..1-%20[SpatialEntity],[SpatialPlacement]<placements%200..*-++[SpatialEntity],[SpatialObjectReference]<object_reference%200..1-++[SpatialEntity],[AnatomicalStructure]<representation_of%200..1-%20[SpatialEntity],[Container]++-%20spatial_entities%200..*>[SpatialEntity],[ExtractionSet]-%20extraction_set_for%201..1>[SpatialEntity],[SpatialPlacement]-%20source%200..1>[SpatialEntity],[SpatialPlacement]-%20target%201..1>[SpatialEntity],[ExtractionSet],[Container],[AnatomicalStructure])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialPlacement],[SpatialObjectReference],[ExtractionSet]<extraction_set%200..1-%20[SpatialEntity&#124;id:string;label:string;creator:string;creator_first_name:string;creator_last_name:string;creator_orcid:string%20%3F;creation_date:date;x_dimension:decimal;y_dimension:decimal;z_dimension:decimal;dimension_unit:DimensionUnitEnum;organ_donor_sex:DonorSexEnum%20%3F;organ_side:OrganSideEnum%20%3F;rui_rank:integer%20%3F],[SpatialEntity]<reference_organ%200..1-%20[SpatialEntity],[SpatialPlacement]<placements%200..*-++[SpatialEntity],[SpatialObjectReference]<object_reference%200..1-++[SpatialEntity],[AnatomicalStructure]<representation_of%200..1-%20[SpatialEntity],[Container]++-%20spatial_entities%200..*>[SpatialEntity],[ExtractionSet]-%20extraction_set_for%201..1>[SpatialEntity],[SpatialPlacement]-%20source%200..1>[SpatialEntity],[SpatialPlacement]-%20target%201..1>[SpatialEntity],[ExtractionSet],[Container],[AnatomicalStructure])

## Referenced by Class

 *  **None** *[➞spatial_entities](container__spatial_entities.md)*  <sub>0..\*</sub>  **[SpatialEntity](SpatialEntity.md)**
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
 * [creator](creator.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [creator_first_name](creator_first_name.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [creator_last_name](creator_last_name.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [creator_orcid](creator_orcid.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [creation_date](creation_date.md)  <sub>1..1</sub>
     * Range: [Date](types/Date.md)
 * [x_dimension](x_dimension.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [y_dimension](y_dimension.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [z_dimension](z_dimension.md)  <sub>1..1</sub>
     * Range: [Decimal](types/Decimal.md)
 * [dimension_unit](dimension_unit.md)  <sub>1..1</sub>
     * Range: [DimensionUnitEnum](DimensionUnitEnum.md)
 * [representation_of](representation_of.md)  <sub>0..1</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)
 * [organ_donor_sex](organ_donor_sex.md)  <sub>0..1</sub>
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

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:SpatialEntity |

