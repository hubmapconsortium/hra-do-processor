
# ds-graph


**metamodel version:** 1.7.0

**version:** None





### Classes

 * [Container](Container.md)
 * [Creator](Creator.md)
     * [Person](Person.md)
     * [SoftwareApplication](SoftwareApplication.md)
 * [Dataset](Dataset.md)
 * [DatasetGraphData](DatasetGraphData.md)
 * [DatasetGraphMetadata](DatasetGraphMetadata.md)
 * [Distribution](Distribution.md)
 * [Donor](Donor.md)
 * [Grant](Grant.md)
 * [ProvEntity](ProvEntity.md)
 * [SoftwareSourceCode](SoftwareSourceCode.md)
 * [SpatialEntity](SpatialEntity.md)
 * [SpatialPlacement](SpatialPlacement.md)
 * [TissueBlock](TissueBlock.md)
 * [TissueSection](TissueSection.md)

### Mixins

 * [Instance](Instance.md)
 * [Named](Named.md)

### Slots

 * [about](about.md)
 * [accessUrl](accessUrl.md)
 * [age](age.md)
 * [awardNumber](awardNumber.md)
 * [bmi](bmi.md)
 * [citation](citation.md)
 * [citationOverall](citationOverall.md)
 * [code_repository](code_repository.md)
 * [collides_with](collides_with.md)
 * [conforms_to](conforms_to.md)
 * [consortium_name](consortium_name.md)
 * [➞data](container__data.md)
 * [➞iri](container__iri.md)
 * [➞metadata](container__metadata.md)
 * [create_date](create_date.md)
 * [created_by](created_by.md)
 * [creation_date](creation_date.md)
 * [creator_name](creator_name.md)
 * [creators](creators.md)
 * [dataset](dataset.md)
 * [datasets](datasets.md)
 * [datatable](datatable.md)
 * [derived_from](derived_from.md)
 * [description](description.md)
 * [dimension_unit](dimension_unit.md)
     * [SpatialEntity➞dimension_unit](SpatialEntity_dimension_unit.md)
 * [distributions](distributions.md)
 * [doi](doi.md)
 * [donor](donor.md)
 * [downloadUrl](downloadUrl.md)
 * [externalReviewers](externalReviewers.md)
 * [external_link](external_link.md)
 * [extraction_site](extraction_site.md)
 * [firstName](firstName.md)
 * [fullName](fullName.md)
 * [funder](funder.md)
 * [funders](funders.md)
 * [had_member](had_member.md)
 * [hubmapId](hubmapId.md)
 * [id](id.md)
 * [label](label.md)
 * [lastName](lastName.md)
 * [license](license.md)
 * [links_back_to](links_back_to.md)
 * [mediaType](mediaType.md)
 * [name](name.md)
 * [orcid](orcid.md)
 * [parent_class](parent_class.md)
 * [partially_overlaps](partially_overlaps.md)
     * [TissueBlock➞partially_overlaps](TissueBlock_partially_overlaps.md)
 * [placement](placement.md)
 * [placement_date](placement_date.md)
 * [pref_label](pref_label.md)
 * [project_leads](project_leads.md)
 * [propertyId](propertyId.md)
 * [provider_name](provider_name.md)
 * [provider_uuid](provider_uuid.md)
 * [publisher](publisher.md)
 * [race](race.md)
     * [Donor➞race](Donor_race.md)
 * [race_id](race_id.md)
     * [Donor➞race_id](Donor_race_id.md)
 * [references](references.md)
 * [reviewers](reviewers.md)
 * [rotation_order](rotation_order.md)
     * [SpatialPlacement➞rotation_order](SpatialPlacement_rotation_order.md)
 * [rotation_unit](rotation_unit.md)
     * [SpatialPlacement➞rotation_unit](SpatialPlacement_rotation_unit.md)
 * [rui_location](rui_location.md)
 * [sample](sample.md)
 * [samples](samples.md)
 * [scaling_unit](scaling_unit.md)
     * [SpatialPlacement➞scaling_unit](SpatialPlacement_scaling_unit.md)
 * [section_count](section_count.md)
 * [section_number](section_number.md)
 * [section_size](section_size.md)
 * [section_size_unit](section_size_unit.md)
 * [sections](sections.md)
 * [see_also](see_also.md)
 * [sex](sex.md)
     * [Donor➞sex](Donor_sex.md)
 * [sex_id](sex_id.md)
     * [Donor➞sex_id](Donor_sex_id.md)
 * [slice_count](slice_count.md)
 * [slice_thickness](slice_thickness.md)
 * [source](source.md)
 * [spatial_entity](spatial_entity.md)
 * [target](target.md)
 * [target_product](target_product.md)
 * [technology](technology.md)
 * [thumbnail](thumbnail.md)
 * [title](title.md)
 * [translation_unit](translation_unit.md)
     * [SpatialPlacement➞translation_unit](SpatialPlacement_translation_unit.md)
 * [type](type.md)
 * [type_of](type_of.md)
 * [value](value.md)
 * [version](version.md)
 * [versionInfo](versionInfo.md)
 * [was_derived_from](was_derived_from.md)
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
