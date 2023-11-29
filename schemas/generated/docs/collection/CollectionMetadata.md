
# Class: CollectionMetadata




URI: [ccf:CollectionMetadata](http://purl.org/ccf/CollectionMetadata)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Dataset],[Container]++-%20metadata%200..1>[CollectionMetadata&#124;title:string%20%3F;description:string%20%3F;created_by:uriorcurie%20%2B;version:string%20%3F;creation_date:string%20%3F;license:string%20%3F;publisher:string%20%3F;see_also:uriorcurie%20%3F;derived_from:uriorcurie%20%3F;had_member(i):uriorcurie%20*],[Collection]^-[CollectionMetadata],[Container],[Collection])](https://yuml.me/diagram/nofunky;dir:TB/class/[Dataset],[Container]++-%20metadata%200..1>[CollectionMetadata&#124;title:string%20%3F;description:string%20%3F;created_by:uriorcurie%20%2B;version:string%20%3F;creation_date:string%20%3F;license:string%20%3F;publisher:string%20%3F;see_also:uriorcurie%20%3F;derived_from:uriorcurie%20%3F;had_member(i):uriorcurie%20*],[Collection]^-[CollectionMetadata],[Container],[Collection])

## Parents

 *  is_a: [Collection](Collection.md)

## Referenced by Class

 *  **None** *[➞metadata](container__metadata.md)*  <sub>0..1</sub>  **[CollectionMetadata](CollectionMetadata.md)**

## Attributes


### Own

 * [title](title.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [description](description.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [created_by](created_by.md)  <sub>1..\*</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [version](version.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [creation_date](creation_date.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [license](license.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [publisher](publisher.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [see_also](see_also.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [derived_from](derived_from.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [had_member](had_member.md)  <sub>0..\*</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Inherited from Collection:

 * [was_derived_from](was_derived_from.md)  <sub>0..1</sub>
     * Range: [Dataset](Dataset.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | dcat:Dataset |

