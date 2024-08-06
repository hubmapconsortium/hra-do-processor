
# Class: FtuIllustration



URI: [ccf:FtuIllustration](http://purl.org/ccf/FtuIllustration)


[![img](images/FtuIllustration.svg)](images/FtuIllustration.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[➞data](container__data.md)*  <sub>0..\*</sub>  **[FtuIllustration](FtuIllustration.md)**

## Attributes


### Own

 * [FtuIllustration➞located_in](FtuIllustration_located_in.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [image_file](image_file.md)  <sub>0..\*</sub>
     * Range: [FtuIllustrationFile](FtuIllustrationFile.md)
 * [illustration_node](illustration_node.md)  <sub>0..\*</sub>
     * Range: [FtuIllustrationNode](FtuIllustrationNode.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Mixed in from Named:

 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [type_of](type_of.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:FtuIllustration |