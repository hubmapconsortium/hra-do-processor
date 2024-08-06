
# Class: ExperimentCycle



URI: [ccf:ExperimentCycle](http://purl.org/ccf/ExperimentCycle)


[![img](images/ExperimentCycle.svg)](images/ExperimentCycle.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[cycles](cycles.md)*  <sub>1..\*</sub>  **[ExperimentCycle](ExperimentCycle.md)**

## Attributes


### Own

 * [cycle_number](cycle_number.md)  <sub>1..1</sub>
     * Range: [Integer](types/Integer.md)
 * [uses_antibody](uses_antibody.md)  <sub>1..\*</sub>
     * Range: [ExperimentUsedAntibody](ExperimentUsedAntibody.md)

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
| **Mappings:** | | ccf:ExperimentCycle |