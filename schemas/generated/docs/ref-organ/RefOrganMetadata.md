
# Class: RefOrganMetadata




URI: [ccf:RefOrganMetadata](http://purl.org/ccf/RefOrganMetadata)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Grant]<funders%200..*-++[RefOrganMetadata&#124;type:string%20%3F;name:string%20%3F;version:string;title:string;description:string;creation_date:date;license:string;publisher:string%20%3F;hubmapId:string%20%3F;doi:uriorcurie%20%3F;citation:string%20%3F;citationOverall:string%20%3F;datatable:string%20*],[Person]<externalReviewers%200..*-++[RefOrganMetadata],[Person]<reviewers%200..*-++[RefOrganMetadata],[Person]<project_leads%200..*-++[RefOrganMetadata],[Person]<creators%201..*-++[RefOrganMetadata],[Container]++-%20metadata%200..1>[RefOrganMetadata],[Person],[Grant],[Container])](https://yuml.me/diagram/nofunky;dir:TB/class/[Grant]<funders%200..*-++[RefOrganMetadata&#124;type:string%20%3F;name:string%20%3F;version:string;title:string;description:string;creation_date:date;license:string;publisher:string%20%3F;hubmapId:string%20%3F;doi:uriorcurie%20%3F;citation:string%20%3F;citationOverall:string%20%3F;datatable:string%20*],[Person]<externalReviewers%200..*-++[RefOrganMetadata],[Person]<reviewers%200..*-++[RefOrganMetadata],[Person]<project_leads%200..*-++[RefOrganMetadata],[Person]<creators%201..*-++[RefOrganMetadata],[Container]++-%20metadata%200..1>[RefOrganMetadata],[Person],[Grant],[Container])

## Referenced by Class

 *  **None** *[➞metadata](container__metadata.md)*  <sub>0..1</sub>  **[RefOrganMetadata](RefOrganMetadata.md)**

## Attributes


### Own

 * [type](type.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [name](name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [version](version.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [title](title.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [description](description.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [creators](creators.md)  <sub>1..\*</sub>
     * Range: [Person](Person.md)
 * [project_leads](project_leads.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [reviewers](reviewers.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [externalReviewers](externalReviewers.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [creation_date](creation_date.md)  <sub>1..1</sub>
     * Range: [Date](types/Date.md)
 * [license](license.md)  <sub>1..1</sub>
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

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Dataset |

