
# Class: SoftwareApplication




URI: [ccf:SoftwareApplication](http://purl.org/ccf/SoftwareApplication)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SoftwareSourceCode],[SoftwareSourceCode]<target_product%200..1-++[SoftwareApplication&#124;version:string%20%3F;id(i):string;name(i):string%20%3F;class_type(i):string],[Creator]^-[SoftwareApplication],[Creator])](https://yuml.me/diagram/nofunky;dir:TB/class/[SoftwareSourceCode],[SoftwareSourceCode]<target_product%200..1-++[SoftwareApplication&#124;version:string%20%3F;id(i):string;name(i):string%20%3F;class_type(i):string],[Creator]^-[SoftwareApplication],[Creator])

## Parents

 *  is_a: [Creator](Creator.md)

## Attributes


### Own

 * [version](version.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [target_product](target_product.md)  <sub>0..1</sub>
     * Range: [SoftwareSourceCode](SoftwareSourceCode.md)

### Inherited from Creator:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [name](name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [class_type](class_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | schema:SoftwareApplication |

