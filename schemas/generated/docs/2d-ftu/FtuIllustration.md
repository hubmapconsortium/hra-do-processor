
# Class: FtuIllustration




URI: [ccf:FtuIllustration](http://purl.org/ccf/FtuIllustration)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[FtuIllustrationNode],[FtuIllustrationFile],[FtuIllustrationNode]<illustration_node%200..*-++[FtuIllustration&#124;id:string;label:string%20%3F;class_type:string%20%3F],[FtuIllustrationFile]<image_file%200..*-++[FtuIllustration],[AnatomicalStructure]<located_in%200..1-%20[FtuIllustration],[Container]++-%20data%200..*>[FtuIllustration],[FtuIllustration]uses%20-.->[Named],[FtuIllustration]uses%20-.->[Instance],[Container],[AnatomicalStructure])](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[FtuIllustrationNode],[FtuIllustrationFile],[FtuIllustrationNode]<illustration_node%200..*-++[FtuIllustration&#124;id:string;label:string%20%3F;class_type:string%20%3F],[FtuIllustrationFile]<image_file%200..*-++[FtuIllustration],[AnatomicalStructure]<located_in%200..1-%20[FtuIllustration],[Container]++-%20data%200..*>[FtuIllustration],[FtuIllustration]uses%20-.->[Named],[FtuIllustration]uses%20-.->[Instance],[Container],[AnatomicalStructure])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[➞data](container__data.md)*  <sub>0..\*</sub>  **[FtuIllustration](FtuIllustration.md)**

## Attributes


### Own

 * [located_in](located_in.md)  <sub>0..1</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)
 * [image_file](image_file.md)  <sub>0..\*</sub>
     * Range: [FtuIllustrationFile](FtuIllustrationFile.md)
 * [illustration_node](illustration_node.md)  <sub>0..\*</sub>
     * Range: [FtuIllustrationNode](FtuIllustrationNode.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [label](label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [class_type](class_type.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [typeOf](typeOf.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:FtuIllustration |

