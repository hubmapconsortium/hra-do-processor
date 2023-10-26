
# Class: LandmarkData




URI: [ccf:LandmarkData](http://purl.org/ccf/LandmarkData)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity],[SpatialEntity]<spatial_entities%201..*-++[LandmarkData],[ExtractionSet]<landmarks%201..*-++[LandmarkData],[Container]++-%20data%200..1>[LandmarkData],[ExtractionSet],[Container])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity],[SpatialEntity]<spatial_entities%201..*-++[LandmarkData],[ExtractionSet]<landmarks%201..*-++[LandmarkData],[Container]++-%20data%200..1>[LandmarkData],[ExtractionSet],[Container])

## Referenced by Class

 *  **None** *[➞data](container__data.md)*  <sub>0..1</sub>  **[LandmarkData](LandmarkData.md)**

## Attributes


### Own

 * [landmarks](landmarks.md)  <sub>1..\*</sub>
     * Range: [ExtractionSet](ExtractionSet.md)
 * [spatial_entities](spatial_entities.md)  <sub>1..\*</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
