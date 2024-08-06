
# Class: FtuIllustrationFile



URI: [ccf:FtuIllustrationFile](http://purl.org/ccf/FtuIllustrationFile)


[![img](images/FtuIllustrationFile.svg)](images/FtuIllustrationFile.svg)

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
| **Mappings:** | | ccf:ImageFile |