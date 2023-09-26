
# Class: Container




URI: [ccf:Container](http://purl.org/ccf/Container)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[FtuIllustration],[DatasetMetadata],[FtuIllustration]<data%200..*-++[Container&#124;iri:uriorcurie%20%3F],[DatasetMetadata]<metadata%200..1-++[Container])](https://yuml.me/diagram/nofunky;dir:TB/class/[FtuIllustration],[DatasetMetadata],[FtuIllustration]<data%200..*-++[Container&#124;iri:uriorcurie%20%3F],[DatasetMetadata]<metadata%200..1-++[Container])

## Attributes


### Own

 * [➞iri](container__iri.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [➞metadata](container__metadata.md)  <sub>0..1</sub>
     * Range: [DatasetMetadata](DatasetMetadata.md)
 * [➞data](container__data.md)  <sub>0..\*</sub>
     * Range: [FtuIllustration](FtuIllustration.md)
