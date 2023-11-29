
# Class: SoftwareApplication




URI: [ccf:SoftwareApplication](http://purl.org/ccf/SoftwareApplication)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SoftwareSourceCode],[SoftwareSourceCode]<target_product%200..1-++[SoftwareApplication&#124;version:string%20%3F;fullName(i):string%20%3F;firstName(i):string%20%3F;lastName(i):string%20%3F;orcid(i):string%20%3F;id(i):string;label(i):string;class_type(i):string%20%3F],[Creator]^-[SoftwareApplication],[Named],[Creator])](https://yuml.me/diagram/nofunky;dir:TB/class/[SoftwareSourceCode],[SoftwareSourceCode]<target_product%200..1-++[SoftwareApplication&#124;version:string%20%3F;fullName(i):string%20%3F;firstName(i):string%20%3F;lastName(i):string%20%3F;orcid(i):string%20%3F;id(i):string;label(i):string;class_type(i):string%20%3F],[Creator]^-[SoftwareApplication],[Named],[Creator])

## Parents

 *  is_a: [Creator](Creator.md)

## Attributes


### Own

 * [version](version.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [target_product](target_product.md)  <sub>0..1</sub>
     * Range: [SoftwareSourceCode](SoftwareSourceCode.md)

### Inherited from Creator:

 * [Creator➞fullName](Creator_fullName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Creator➞firstName](Creator_firstName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Creator➞lastName](Creator_lastName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Creator➞orcid](Creator_orcid.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | schema:SoftwareApplication |

