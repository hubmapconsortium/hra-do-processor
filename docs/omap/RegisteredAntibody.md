
# Class: RegisteredAntibody



URI: [ccf:RegisteredAntibody](http://purl.org/ccf/RegisteredAntibody)


[![img](images/RegisteredAntibody.svg)](images/RegisteredAntibody.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[based_on](based_on.md)*  <sub>1..1</sub>  **[RegisteredAntibody](RegisteredAntibody.md)**

## Attributes


### Own

 * [lot_number](lot_number.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [Uriorcurie](types/Uriorcurie.md)

### Mixed in from Named:

 * [label](label.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [type_of](type_of.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)
