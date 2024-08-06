
# Class: Dataset



URI: [dcat:Dataset](http://www.w3.org/ns/dcat#Dataset)


[![img](images/Dataset.svg)](images/Dataset.svg)

## Parents

 *  is_a: [ProvEntity](ProvEntity.md)

## Referenced by Class

 *  **None** *[was_derived_from](was_derived_from.md)*  <sub>0..1</sub>  **[Dataset](Dataset.md)**

## Attributes


### Own

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

### Inherited from ProvEntity:

 * [was_derived_from](was_derived_from.md)  <sub>0..1</sub>
     * Range: [Dataset](Dataset.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Dataset |