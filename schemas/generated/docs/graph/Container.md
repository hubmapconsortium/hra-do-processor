
# Class: Container




URI: [ccf:Container](http://purl.org/ccf/Container)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[BasicMetadata]<metadata%200..1-++[Container&#124;iri:uriorcurie%20%3F;data:string%20%2B],[BasicMetadata])](https://yuml.me/diagram/nofunky;dir:TB/class/[BasicMetadata]<metadata%200..1-++[Container&#124;iri:uriorcurie%20%3F;data:string%20%2B],[BasicMetadata])

## Attributes


### Own

 * [➞iri](container__iri.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [➞metadata](container__metadata.md)  <sub>0..1</sub>
     * Range: [BasicMetadata](BasicMetadata.md)
 * [➞data](container__data.md)  <sub>1..\*</sub>
     * Range: [String](types/String.md)
