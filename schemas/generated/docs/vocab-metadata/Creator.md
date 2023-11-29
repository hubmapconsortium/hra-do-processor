
# Class: Creator




URI: [dcat:Creator](http://www.w3.org/ns/dcat#Creator)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[SoftwareApplication],[Person],[Container]++-%20creators%201..*>[Creator&#124;id:string;name:string%20%3F;class_type:string%20%3F],[Container]++-%20creators(i)%200..*>[Creator],[Dataset]++-%20creators%200..*>[Creator],[Creator]^-[SoftwareApplication],[Creator]^-[Person],[Dataset],[Container])](https://yuml.me/diagram/nofunky;dir:TB/class/[SoftwareApplication],[Person],[Container]++-%20creators%201..*>[Creator&#124;id:string;name:string%20%3F;class_type:string%20%3F],[Container]++-%20creators(i)%200..*>[Creator],[Dataset]++-%20creators%200..*>[Creator],[Creator]^-[SoftwareApplication],[Creator]^-[Person],[Dataset],[Container])

## Children

 * [Person](Person.md)
 * [SoftwareApplication](SoftwareApplication.md)

## Referenced by Class

 *  **[Container](Container.md)** *[Container➞creators](Container_creators.md)*  <sub>1..\*</sub>  **[Creator](Creator.md)**
 *  **None** *[creators](creators.md)*  <sub>0..\*</sub>  **[Creator](Creator.md)**

## Attributes


### Own

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)
 * [name](name.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
 * [class_type](class_type.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)
