
# Class: Creator




URI: [ccf:Creator](http://purl.org/ccf/Creator)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[SpatialEntity]++-%20creator%201..*>[Creator&#124;fullName:string%20%3F;firstName:string%20%3F;lastName:string%20%3F;orcid:string%20%3F;id:string;label:string;class_type:string%20%3F],[Creator]uses%20-.->[Named],[Creator]uses%20-.->[Instance],[SpatialEntity])](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[SpatialEntity]++-%20creator%201..*>[Creator&#124;fullName:string%20%3F;firstName:string%20%3F;lastName:string%20%3F;orcid:string%20%3F;id:string;label:string;class_type:string%20%3F],[Creator]uses%20-.->[Named],[Creator]uses%20-.->[Instance],[SpatialEntity])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[creator](creator.md)*  <sub>1..\*</sub>  **[Creator](Creator.md)**

## Attributes


### Own

 * [Creator➞fullName](Creator_fullName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Creator➞firstName](Creator_firstName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Creator➞lastName](Creator_lastName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Creator➞orcid](Creator_orcid.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [label](label.md)  <sub>1..1</sub>
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
| **Mappings:** | | schema:Person |

