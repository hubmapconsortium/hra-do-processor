
# landmark


**metamodel version:** 1.7.0

**version:** None





### Classes

 * [Container](Container.md)
 * [Creator](Creator.md)
 * [DatasetMetadata](DatasetMetadata.md)
 * [Distribution](Distribution.md)
 * [ExtractionSet](ExtractionSet.md)
 * [Grant](Grant.md)
 * [LandmarkData](LandmarkData.md)
 * [LandmarkMetadata](LandmarkMetadata.md)
 * [Person](Person.md)
 * [SpatialEntity](SpatialEntity.md)
 * [SpatialObjectReference](SpatialObjectReference.md)
 * [SpatialPlacement](SpatialPlacement.md)

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
 * [➞data](container__data.md)
 * [➞iri](container__iri.md)
 * [➞metadata](container__metadata.md)
 * [creation_date](creation_date.md)
 * [creator](creator.md)
 * [creators](creators.md)
 * [datatable](datatable.md)
 * [description](description.md)
 * [dimension_unit](dimension_unit.md)
 * [distributions](distributions.md)
 * [doi](doi.md)
 * [downloadUrl](downloadUrl.md)
 * [externalReviewers](externalReviewers.md)
 * [extraction_set](extraction_set.md)
 * [extraction_set_for](extraction_set_for.md)
 * [file](file.md)
 * [file_format](file_format.md)
 * [file_subpath](file_subpath.md)
 * [firstName](firstName.md)
     * [Creator➞firstName](Creator_firstName.md)
 * [fullName](fullName.md)
     * [Creator➞fullName](Creator_fullName.md)
 * [funder](funder.md)
 * [funders](funders.md)
 * [hubmapId](hubmapId.md)
 * [id](id.md)
 * [iri](iri.md)
 * [label](label.md)
 * [landmarks](landmarks.md)
 * [lastName](lastName.md)
     * [Creator➞lastName](Creator_lastName.md)
 * [license](license.md)
 * [mediaType](mediaType.md)
 * [object_reference](object_reference.md)
 * [orcid](orcid.md)
     * [Creator➞orcid](Creator_orcid.md)
 * [placement](placement.md)
 * [placements](placements.md)
 * [pref_label](pref_label.md)
 * [project_leads](project_leads.md)
 * [propertyId](propertyId.md)
 * [publisher](publisher.md)
 * [reference_organ](reference_organ.md)
 * [reviewers](reviewers.md)
 * [rotation_order](rotation_order.md)
 * [rotation_unit](rotation_unit.md)
 * [rui_rank](rui_rank.md)
 * [scaling_unit](scaling_unit.md)
 * [see_also](see_also.md)
 * [spatial_entities](spatial_entities.md)
 * [target](target.md)
 * [title](title.md)
 * [translation_unit](translation_unit.md)
 * [typeOf](typeOf.md)
 * [value](value.md)
 * [version](version.md)
 * [versionInfo](versionInfo.md)
 * [x_dimension](x_dimension.md)
 * [x_rotation](x_rotation.md)
 * [x_scaling](x_scaling.md)
 * [x_translation](x_translation.md)
 * [y_dimension](y_dimension.md)
 * [y_rotation](y_rotation.md)
 * [y_scaling](y_scaling.md)
 * [y_translation](y_translation.md)
 * [z_dimension](z_dimension.md)
 * [z_rotation](z_rotation.md)
 * [z_scaling](z_scaling.md)
 * [z_translation](z_translation.md)

### Enums

 * [DimensionUnitEnum](DimensionUnitEnum.md)
 * [RotationUnitEnum](RotationUnitEnum.md)
 * [ScalingUnitEnum](ScalingUnitEnum.md)
 * [TranslationUnitEnum](TranslationUnitEnum.md)

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
