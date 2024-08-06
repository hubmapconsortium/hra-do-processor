
# Class: Container



URI: [dcat:Container](http://www.w3.org/ns/dcat#Container)


[![img](images/Container.svg)](images/Container.svg)

## Uses Mixin

 *  mixin: [ProvEntity](ProvEntity.md)

## Referenced by Class


## Attributes


### Own

 * [name](name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [type](type.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Container➞title](Container_title.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞description](Container_description.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞version](Container_version.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞creators](Container_creators.md)  <sub>1..\*</sub>
     * Range: [Creator](Creator.md)
 * [Container➞creation_date](Container_creation_date.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [publisher](publisher.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Container➞license](Container_license.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [see_also](see_also.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [Container➞distributions](Container_distributions.md)  <sub>1..\*</sub>
     * Range: [Distribution](Distribution.md)

### Mixed in from ProvEntity:

 * [was_derived_from](was_derived_from.md)  <sub>0..1</sub>
     * Range: [Dataset](Dataset.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Dataset |