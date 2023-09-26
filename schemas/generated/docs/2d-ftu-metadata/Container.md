
# Class: Container




URI: [dcat:Container](http://www.w3.org/ns/dcat#Container)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Person],[Grant],[Distribution],[Distribution]<distributions%201..*-++[Container&#124;iri:string;title:string;description:string;version:string;creation_date:string;license:string;publisher:string%20%3F;hubmapId:string%20%3F;doi:uriorcurie%20%3F;citation:string%20%3F;citationOverall:string%20%3F;datatable:string%20*],[Grant]<funders%200..*-++[Container],[Person]<externalReviewers%200..*-++[Container],[Person]<reviewers%200..*-++[Container],[Person]<project_leads%200..*-++[Container],[Person]<creators%201..*-++[Container])](https://yuml.me/diagram/nofunky;dir:TB/class/[Person],[Grant],[Distribution],[Distribution]<distributions%201..*-++[Container&#124;iri:string;title:string;description:string;version:string;creation_date:string;license:string;publisher:string%20%3F;hubmapId:string%20%3F;doi:uriorcurie%20%3F;citation:string%20%3F;citationOverall:string%20%3F;datatable:string%20*],[Grant]<funders%200..*-++[Container],[Person]<externalReviewers%200..*-++[Container],[Person]<reviewers%200..*-++[Container],[Person]<project_leads%200..*-++[Container],[Person]<creators%201..*-++[Container])

## Referenced by Class


## Attributes


### Own

 * [Container➞iri](Container_iri.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞title](Container_title.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞description](Container_description.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞creators](Container_creators.md)  <sub>1..\*</sub>
     * Range: [Person](Person.md)
 * [project_leads](project_leads.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [reviewers](reviewers.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [externalReviewers](externalReviewers.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [Container➞version](Container_version.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞creation_date](Container_creation_date.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [Container➞license](Container_license.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [publisher](publisher.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [funders](funders.md)  <sub>0..\*</sub>
     * Range: [Grant](Grant.md)
 * [hubmapId](hubmapId.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [doi](doi.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [citation](citation.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [citationOverall](citationOverall.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [datatable](datatable.md)  <sub>0..\*</sub>
     * Range: [String](types/String.md)
 * [Container➞distributions](Container_distributions.md)  <sub>1..\*</sub>
     * Range: [Distribution](Distribution.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Dataset |

