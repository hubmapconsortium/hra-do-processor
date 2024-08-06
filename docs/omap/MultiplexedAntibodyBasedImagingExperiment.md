
# Class: MultiplexedAntibodyBasedImagingExperiment



URI: [ccf:MultiplexedAntibodyBasedImagingExperiment](http://purl.org/ccf/MultiplexedAntibodyBasedImagingExperiment)


[![img](images/MultiplexedAntibodyBasedImagingExperiment.svg)](images/MultiplexedAntibodyBasedImagingExperiment.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[experiment](experiment.md)*  <sub>1..1</sub>  **[MultiplexedAntibodyBasedImagingExperiment](MultiplexedAntibodyBasedImagingExperiment.md)**

## Attributes


### Own

 * [method](method.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [tissue_preservation](tissue_preservation.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [MultiplexedAntibodyBasedImagingExperiment➞protocol_doi](MultiplexedAntibodyBasedImagingExperiment_protocol_doi.md)  <sub>0..\*</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [MultiplexedAntibodyBasedImagingExperiment➞author_orcid](MultiplexedAntibodyBasedImagingExperiment_author_orcid.md)  <sub>1..\*</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [has_cycle](has_cycle.md)  <sub>1..\*</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [sample_organ](sample_organ.md)  <sub>1..1</sub>
     * Range: [AnatomicalStructure](AnatomicalStructure.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Mixed in from Named:

 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [type_of](type_of.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:MultiplexedAntibodyBasedImagingExperiment |