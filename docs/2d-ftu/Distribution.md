
# Class: Distribution



URI: [ccf:Distribution](http://purl.org/ccf/Distribution)


[![img](images/Distribution.svg)](images/Distribution.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)

## Referenced by Class

 *  **None** *[distributions](distributions.md)*  <sub>0..\*</sub>  **[Distribution](Distribution.md)**

## Attributes


### Own

 * [title](title.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [downloadUrl](downloadUrl.md)  <sub>0..1</sub>
     * Range: [Uri](types/Uri.md)
 * [accessUrl](accessUrl.md)  <sub>0..1</sub>
     * Range: [Uri](types/Uri.md)
 * [mediaType](mediaType.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Mixed in from Named:

 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Distribution |