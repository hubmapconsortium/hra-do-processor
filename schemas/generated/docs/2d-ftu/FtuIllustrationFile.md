
# Class: FtuIllustrationFile




URI: [ccf:FtuIllustrationFile](http://purl.org/ccf/FtuIllustrationFile)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[FtuIllustration]++-%20image_file%200..*>[FtuIllustrationFile&#124;file_url:uri%20%3F;file_format:string%20%3F;id:string;label:string%20%3F;class_type:string%20%3F],[FtuIllustrationFile]uses%20-.->[Named],[FtuIllustrationFile]uses%20-.->[Instance],[FtuIllustration])](https://yuml.me/diagram/nofunky;dir:TB/class/[Named],[Instance],[FtuIllustration]++-%20image_file%200..*>[FtuIllustrationFile&#124;file_url:uri%20%3F;file_format:string%20%3F;id:string;label:string%20%3F;class_type:string%20%3F],[FtuIllustrationFile]uses%20-.->[Named],[FtuIllustrationFile]uses%20-.->[Instance],[FtuIllustration])

## Uses Mixin

 *  mixin: [Named](Named.md)
 *  mixin: [Instance](Instance.md)

## Referenced by Class

 *  **None** *[image_file](image_file.md)*  <sub>0..\*</sub>  **[FtuIllustrationFile](FtuIllustrationFile.md)**

## Attributes


### Own

 * [file_url](file_url.md)  <sub>0..1</sub>
     * Range: [Uri](types/Uri.md)
 * [file_format](file_format.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [id](id.md)  <sub>1..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [label](label.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Named:

 * [class_type](class_type.md)  <sub>0..1</sub>
     * Range: [String](types/String.md)

### Mixed in from Instance:

 * [typeOf](typeOf.md)  <sub>0..\*</sub>
     * Range: [Named](Named.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | ccf:ImageFile |

