
# Class: Person




URI: [dcat:Person](http://www.w3.org/ns/dcat#Person)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Dataset]++-%20externalReviewers%200..*>[Person&#124;fullName:string%20%3F;firstName:string%20%3F;lastName:string%20%3F;orcid:string%20%3F;id(i):string;name(i):string%20%3F;class_type(i):string%20%3F],[Dataset]++-%20project_leads%200..*>[Person],[Dataset]++-%20reviewers%200..*>[Person],[Creator]^-[Person],[Dataset],[Creator])](https://yuml.me/diagram/nofunky;dir:TB/class/[Dataset]++-%20externalReviewers%200..*>[Person&#124;fullName:string%20%3F;firstName:string%20%3F;lastName:string%20%3F;orcid:string%20%3F;id(i):string;name(i):string%20%3F;class_type(i):string%20%3F],[Dataset]++-%20project_leads%200..*>[Person],[Dataset]++-%20reviewers%200..*>[Person],[Creator]^-[Person],[Dataset],[Creator])

## Parents

 *  is_a: [Creator](Creator.md)

## Referenced by Class

 *  **None** *[externalReviewers](externalReviewers.md)*  <sub>0..\*</sub>  **[Person](Person.md)**
 *  **None** *[project_leads](project_leads.md)*  <sub>0..\*</sub>  **[Person](Person.md)**
 *  **None** *[reviewers](reviewers.md)*  <sub>0..\*</sub>  **[Person](Person.md)**

## Attributes


### Own

 * [fullName](fullName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [firstName](firstName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [lastName](lastName.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [orcid](orcid.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Inherited from Creator:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [name](name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [class_type](class_type.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | schema:Person |

