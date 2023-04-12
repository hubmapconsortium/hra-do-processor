
# Class: Container




URI: [ccf:Container](http://purl.org/ccf/Container)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[AsctbDataset]<data%200..1-++[Container&#124;id:uriorcurie],[AsctbMetadata]<metadata%200..1-++[Container],[AsctbMetadata],[AsctbDataset])](https://yuml.me/diagram/nofunky;dir:TB/class/[AsctbDataset]<data%200..1-++[Container&#124;id:uriorcurie],[AsctbMetadata]<metadata%200..1-++[Container],[AsctbMetadata],[AsctbDataset])

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [➞metadata](container__metadata.md)  <sub>0..1</sub>
     * Range: [AsctbMetadata](AsctbMetadata.md)
 * [➞data](container__data.md)  <sub>0..1</sub>
     * Range: [AsctbDataset](AsctbDataset.md)
