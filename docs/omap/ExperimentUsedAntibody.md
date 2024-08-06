
# Class: ExperimentUsedAntibody



URI: [ccf:ExperimentUsedAntibody](http://purl.org/ccf/ExperimentUsedAntibody)


[![img](images/ExperimentUsedAntibody.svg)](images/ExperimentUsedAntibody.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[has_antibody_component](has_antibody_component.md)*  <sub>1..\*</sub>  **[ExperimentUsedAntibody](ExperimentUsedAntibody.md)**
 *  **None** *[uses_antibody](uses_antibody.md)*  <sub>1..\*</sub>  **[ExperimentUsedAntibody](ExperimentUsedAntibody.md)**

## Attributes


### Own

 * [concentration](concentration.md)  <sub>0..1</sub>
     * Range: [Float](types/Float.md)
 * [dilution](dilution.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)
 * [cycle_number](cycle_number.md)  <sub>1..1</sub>
     * Range: [Integer](types/Integer.md)
 * [is_core_panel](is_core_panel.md)  <sub>1..1</sub>
     * Range: [Boolean](types/Boolean.md)
 * [used_by_experiment](used_by_experiment.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)
 * [based_on](based_on.md)  <sub>1..1</sub>
     * Range: [RegisteredAntibody](RegisteredAntibody.md)

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
| **Mappings:** | | ccf:ExperimentUsedAntibody |