
# Class: SoftwareApplication



URI: [dcat:SoftwareApplication](http://www.w3.org/ns/dcat#SoftwareApplication)


[![img](images/SoftwareApplication.svg)](images/SoftwareApplication.svg)

## Parents

 *  is_a: [Creator](Creator.md)

## Uses Mixin

 *  mixin: [Instance](Instance.md)

## Attributes


### Own

 * [name](name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [version](version.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [target_product](target_product.md)  <sub>0..1</sub>
     * Range: [SoftwareSourceCode](SoftwareSourceCode.md)

### Inherited from Creator:

 * [conforms_to](conforms_to.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [type_of](type_of.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | schema:SoftwareApplication |