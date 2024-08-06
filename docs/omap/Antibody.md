
# Class: Antibody



URI: [ccf:Antibody](http://purl.org/ccf/Antibody)


[![img](images/Antibody.svg)](images/Antibody.svg)

## Referenced by Class

 *  **None** *[antibody](antibody.md)*  <sub>1..\*</sub>  **[Antibody](Antibody.md)**
 *  **None** *[antibody_id](antibody_id.md)*  <sub>1..1</sub>  **[Antibody](Antibody.md)**

## Attributes


### Own

 * [Antibody➞id](Antibody_id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [parent_class](parent_class.md)  <sub>0..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [Antibody➞antibody_type](Antibody_antibody_type.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [host](host.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [isotype](isotype.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [clonality](clonality.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [clone_id](clone_id.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [conjugate](conjugate.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [fluorescent](fluorescent.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [recombinant](recombinant.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [producer](producer.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [catalog_number](catalog_number.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [detects](detects.md)  <sub>0..\*</sub>
     * Range: [DetectStatement](DetectStatement.md)
 * [binds_to](binds_to.md)  <sub>0..\*</sub>
     * Range: [BindsToStatement](BindsToStatement.md)
