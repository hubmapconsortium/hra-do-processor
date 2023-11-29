
# Class: Dataset




URI: [ccf:Dataset](http://purl.org/ccf/Dataset)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Person],[Grant],[Distribution],[Distribution]<distributions%200..*-++[Dataset&#124;id:string;title:string%20%3F;description:string%20%3F;creation_date:string%20%3F;version:string%20%3F;license:string%20%3F;see_also:uriorcurie%20%3F;publisher:string%20%3F;citation:string%20%3F;citationOverall:string%20%3F;doi:uriorcurie%20%3F;hubmapId:string%20%3F],[Person]<externalReviewers%200..*-++[Dataset],[Person]<project_leads%200..*-++[Dataset],[Grant]<funders%200..*-++[Dataset],[Person]<reviewers%200..*-++[Dataset],[Creator]<creators%200..*-++[Dataset],[ProvEntity]++-%20was_derived_from%200..1>[Dataset],[ProvEntity],[Creator])](https://yuml.me/diagram/nofunky;dir:TB/class/[Person],[Grant],[Distribution],[Distribution]<distributions%200..*-++[Dataset&#124;id:string;title:string%20%3F;description:string%20%3F;creation_date:string%20%3F;version:string%20%3F;license:string%20%3F;see_also:uriorcurie%20%3F;publisher:string%20%3F;citation:string%20%3F;citationOverall:string%20%3F;doi:uriorcurie%20%3F;hubmapId:string%20%3F],[Person]<externalReviewers%200..*-++[Dataset],[Person]<project_leads%200..*-++[Dataset],[Grant]<funders%200..*-++[Dataset],[Person]<reviewers%200..*-++[Dataset],[Creator]<creators%200..*-++[Dataset],[ProvEntity]++-%20was_derived_from%200..1>[Dataset],[ProvEntity],[Creator])

## Referenced by Class

 *  **None** *[was_derived_from](was_derived_from.md)*  <sub>0..1</sub>  **[Dataset](Dataset.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [title](title.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [description](description.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [creators](creators.md)  <sub>0..\*</sub>
     * Range: [Creator](Creator.md)
 * [reviewers](reviewers.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [creation_date](creation_date.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [version](version.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [license](license.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [see_also](see_also.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [publisher](publisher.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [citation](citation.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [citationOverall](citationOverall.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [funders](funders.md)  <sub>0..\*</sub>
     * Range: [Grant](Grant.md)
 * [doi](doi.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [hubmapId](hubmapId.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [project_leads](project_leads.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [externalReviewers](externalReviewers.md)  <sub>0..\*</sub>
     * Range: [Person](Person.md)
 * [distributions](distributions.md)  <sub>0..\*</sub>
     * Range: [Distribution](Distribution.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Dataset |

