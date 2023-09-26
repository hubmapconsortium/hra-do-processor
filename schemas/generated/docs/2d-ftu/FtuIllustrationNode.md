
# Class: FtuIllustrationNode




URI: [ccf:FtuIllustrationNode](http://purl.org/ccf/FtuIllustrationNode)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[FtuIllustration]++-%20illustration_node%200..*>[FtuIllustrationNode&#124;node_name:string%20%3F;part_of_illustration:string%20%3F;id:string;label:string%20%3F;class_type:string%20%3F],[FtuIllustrationNode]uses%20-.->[Named],[FtuIllustrationNode]uses%20-.->[Instance],[FtuIllustration])](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[FtuIllustration]++-%20illustration_node%200..*>[FtuIllustrationNode&#124;node_name:string%20%3F;part_of_illustration:string%20%3F;id:string;label:string%20%3F;class_type:string%20%3F],[FtuIllustrationNode]uses%20-.->[Named],[FtuIllustrationNode]uses%20-.->[Instance],[FtuIllustration])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[illustration_node](illustration_node.md)*  <sub>0..\*</sub>  **[FtuIllustrationNode](FtuIllustrationNode.md)**

## Attributes


### Own

 * [node_name](node_name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [part_of_illustration](part_of_illustration.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

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
| **Mappings:** | | ccf:FtuIllustrationNode |

