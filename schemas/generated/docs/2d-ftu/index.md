
# ftu-2d


**metamodel version:** 1.7.0

**version:** None





### Classes

 * [AnatomicalStructure](AnatomicalStructure.md)
 * [Container](Container.md)
 * [Creator](Creator.md)
     * [Person](Person.md)
     * [SoftwareApplication](SoftwareApplication.md)
 * [Dataset](Dataset.md)
 * [Distribution](Distribution.md)
 * [FtuIllustration](FtuIllustration.md)
 * [FtuIllustrationFile](FtuIllustrationFile.md)
 * [FtuIllustrationNode](FtuIllustrationNode.md)
 * [FtuMetadata](FtuMetadata.md)
 * [Grant](Grant.md)
 * [ProvEntity](ProvEntity.md)
     * [Collection](Collection.md)
 * [SoftwareSourceCode](SoftwareSourceCode.md)

### Mixins

 * [Instance](Instance.md)
 * [Named](Named.md)

### Slots

 * [about](about.md)
 * [accessUrl](accessUrl.md)
 * [awardNumber](awardNumber.md)
 * [citation](citation.md)
 * [citationOverall](citationOverall.md)
 * [class_type](class_type.md)
 * [code_repository](code_repository.md)
 * [➞data](container__data.md)
 * [➞iri](container__iri.md)
 * [➞metadata](container__metadata.md)
 * [created_by](created_by.md)
 * [creation_date](creation_date.md)
 * [creators](creators.md)
 * [datatable](datatable.md)
 * [derived_from](derived_from.md)
 * [description](description.md)
 * [distributions](distributions.md)
 * [doi](doi.md)
 * [downloadUrl](downloadUrl.md)
 * [externalReviewers](externalReviewers.md)
 * [file_format](file_format.md)
 * [file_url](file_url.md)
 * [firstName](firstName.md)
 * [fullName](fullName.md)
 * [funder](funder.md)
 * [funders](funders.md)
 * [had_member](had_member.md)
 * [hubmapId](hubmapId.md)
 * [id](id.md)
     * [AnatomicalStructure➞id](AnatomicalStructure_id.md)
 * [illustration_node](illustration_node.md)
 * [image_file](image_file.md)
 * [label](label.md)
 * [lastName](lastName.md)
 * [license](license.md)
 * [located_in](located_in.md)
 * [mediaType](mediaType.md)
 * [name](name.md)
 * [node_name](node_name.md)
 * [orcid](orcid.md)
 * [part_of_illustration](part_of_illustration.md)
 * [project_leads](project_leads.md)
 * [propertyId](propertyId.md)
 * [publisher](publisher.md)
 * [reviewers](reviewers.md)
 * [see_also](see_also.md)
 * [target_product](target_product.md)
 * [title](title.md)
 * [typeOf](typeOf.md)
 * [value](value.md)
 * [version](version.md)
 * [versionInfo](versionInfo.md)
 * [was_derived_from](was_derived_from.md)

### Enums


### Subsets


### Types


#### Built in

 * **Bool**
 * **Curie**
 * **Decimal**
 * **ElementIdentifier**
 * **NCName**
 * **NodeIdentifier**
 * **URI**
 * **URIorCURIE**
 * **XSDDate**
 * **XSDDateTime**
 * **XSDTime**
 * **float**
 * **int**
 * **str**

#### Defined

 * [Boolean](types/Boolean.md)  (**Bool**)  - A binary (true or false) value
 * [Curie](types/Curie.md)  (**Curie**)  - a compact URI
 * [Date](types/Date.md)  (**XSDDate**)  - a date (year, month and day) in an idealized calendar
 * [DateOrDatetime](types/DateOrDatetime.md)  (**str**)  - Either a date or a datetime
 * [Datetime](types/Datetime.md)  (**XSDDateTime**)  - The combination of a date and time
 * [Decimal](types/Decimal.md)  (**Decimal**)  - A real number with arbitrary precision that conforms to the xsd:decimal specification
 * [Double](types/Double.md)  (**float**)  - A real number that conforms to the xsd:double specification
 * [Float](types/Float.md)  (**float**)  - A real number that conforms to the xsd:float specification
 * [Integer](types/Integer.md)  (**int**)  - An integer
 * [Jsonpath](types/Jsonpath.md)  (**str**)  - A string encoding a JSON Path. The value of the string MUST conform to JSON Point syntax and SHOULD dereference to zero or more valid objects within the current instance document when encoded in tree form.
 * [Jsonpointer](types/Jsonpointer.md)  (**str**)  - A string encoding a JSON Pointer. The value of the string MUST conform to JSON Point syntax and SHOULD dereference to a valid object within the current instance document when encoded in tree form.
 * [Ncname](types/Ncname.md)  (**NCName**)  - Prefix part of CURIE
 * [Nodeidentifier](types/Nodeidentifier.md)  (**NodeIdentifier**)  - A URI, CURIE or BNODE that represents a node in a model.
 * [Objectidentifier](types/Objectidentifier.md)  (**ElementIdentifier**)  - A URI or CURIE that represents an object in the model.
 * [Sparqlpath](types/Sparqlpath.md)  (**str**)  - A string encoding a SPARQL Property Path. The value of the string MUST conform to SPARQL syntax and SHOULD dereference to zero or more valid objects within the current instance document when encoded as RDF.
 * [String](types/String.md)  (**str**)  - A character string
 * [Time](types/Time.md)  (**XSDTime**)  - A time object represents a (local) time of day, independent of any particular day
 * [Uri](types/Uri.md)  (**URI**)  - a complete URI
 * [Uriorcurie](types/Uriorcurie.md)  (**URIorCURIE**)  - a URI or a CURIE
