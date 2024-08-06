
# Class: Person



URI: [dcat:Person](http://www.w3.org/ns/dcat#Person)


[![img](images/Person.svg)](images/Person.svg)

## Parents

 *  is_a: [Creator](Creator.md)

## Uses Mixin

 *  mixin: [Instance](Instance.md)

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

 * [conforms_to](conforms_to.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [type_of](type_of.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | schema:Person |