
# Class: Container




URI: [ccf:Container](http://purl.org/ccf/Container)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity],[RefOrganMetadata],[SpatialEntity]<data%200..*-++[Container&#124;id:uriorcurie%20%3F],[RefOrganMetadata]<metadata%200..1-++[Container])](https://yuml.me/diagram/nofunky;dir:TB/class/[SpatialEntity],[RefOrganMetadata],[SpatialEntity]<data%200..*-++[Container&#124;id:uriorcurie%20%3F],[RefOrganMetadata]<metadata%200..1-++[Container])

## Attributes


### Own

 * [➞id](container__id.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [➞metadata](container__metadata.md)  <sub>0..1</sub>
     * Range: [RefOrganMetadata](RefOrganMetadata.md)
 * [➞data](container__data.md)  <sub>0..\*</sub>
     * Range: [SpatialEntity](SpatialEntity.md)
