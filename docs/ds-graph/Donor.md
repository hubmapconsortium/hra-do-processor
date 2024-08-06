
# Class: Donor



URI: [ccf:Donor](http://purl.org/ccf/Donor)


[![img](images/Donor.svg)](images/Donor.svg)

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[donor](donor.md)*  <sub>0..\*</sub>  **[Donor](Donor.md)**

## Attributes


### Own

 * [pref_label](pref_label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [description](description.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [external_link](external_link.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [age](age.md)  <sub>0..1</sub>
     * Range: [Integer](types/Integer.md)
 * [bmi](bmi.md)  <sub>0..1</sub>
     * Range: [Float](types/Float.md)
 * [Donor➞sex](Donor_sex.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Donor➞sex_id](Donor_sex_id.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Donor➞race](Donor_race.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [Donor➞race_id](Donor_race_id.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [consortium_name](consortium_name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [provider_name](provider_name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [provider_uuid](provider_uuid.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [samples](samples.md)  <sub>0..\*</sub>
     * Range: [TissueBlock](TissueBlock.md)

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
| **Mappings:** | | ccf:Donor |