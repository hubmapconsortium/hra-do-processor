
# Class: Container




URI: [dcat:Container](http://www.w3.org/ns/dcat#Container)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Distribution],[Dataset],[Creator],[Distribution]<distributions%201..*-++[Container&#124;id:string;title:string;description:string;version:string;creation_date:string;publisher:string%20%3F;license:string;see_also:uriorcurie%20%3F;had_member(i):uriorcurie%20*],[Creator]<creators%201..*-++[Container],[Collection]^-[Container],[Collection])](https://yuml.me/diagram/nofunky;dir:TB/class/[Distribution],[Dataset],[Creator],[Distribution]<distributions%201..*-++[Container&#124;id:string;title:string;description:string;version:string;creation_date:string;publisher:string%20%3F;license:string;see_also:uriorcurie%20%3F;had_member(i):uriorcurie%20*],[Creator]<creators%201..*-++[Container],[Collection]^-[Container],[Collection])

## Parents

 *  is_a: [Collection](Collection.md)

## Referenced by Class


## Attributes


### Own

 * [Container➞id](Container_id.md)  <sub>1..1</sub>
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

### Inherited from Collection:

 * [was_derived_from](was_derived_from.md)  <sub>0..1</sub>
     * Range: [Dataset](Dataset.md)
 * [had_member](had_member.md)  <sub>0..\*</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Dataset |

