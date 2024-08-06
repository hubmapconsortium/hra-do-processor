
# omap


**metamodel version:** 1.7.0

**version:** None





### Classes

 * [AnatomicalStructure](AnatomicalStructure.md)
 * [Antibody](Antibody.md)
 * [BindsToStatement](BindsToStatement.md)
 * [Container](Container.md)
 * [CoreAntibodyPanel](CoreAntibodyPanel.md)
 * [Creator](Creator.md)
     * [Person](Person.md)
     * [SoftwareApplication](SoftwareApplication.md)
 * [DetectStatement](DetectStatement.md)
 * [Distribution](Distribution.md)
 * [ExperimentCycle](ExperimentCycle.md)
 * [ExperimentUsedAntibody](ExperimentUsedAntibody.md)
 * [Grant](Grant.md)
 * [MultiplexedAntibodyBasedImagingExperiment](MultiplexedAntibodyBasedImagingExperiment.md)
 * [OmapDataset](OmapDataset.md)
 * [OmapMetadata](OmapMetadata.md)
 * [Protein](Protein.md)
 * [ProvEntity](ProvEntity.md)
     * [Dataset](Dataset.md)
 * [RegisteredAntibody](RegisteredAntibody.md)
 * [SoftwareSourceCode](SoftwareSourceCode.md)

### Mixins

 * [Instance](Instance.md)
 * [Named](Named.md)

### Slots

 * [about](about.md)
 * [accessUrl](accessUrl.md)
 * [antibody](antibody.md)
 * [antibody_id](antibody_id.md)
 * [antibody_type](antibody_type.md)
     * [Antibody➞antibody_type](Antibody_antibody_type.md)
 * [author_orcid](author_orcid.md)
     * [MultiplexedAntibodyBasedImagingExperiment➞author_orcid](MultiplexedAntibodyBasedImagingExperiment_author_orcid.md)
 * [awardNumber](awardNumber.md)
 * [based_on](based_on.md)
 * [binds_to](binds_to.md)
 * [catalog_number](catalog_number.md)
 * [citation](citation.md)
 * [citationOverall](citationOverall.md)
 * [clonality](clonality.md)
 * [clone_id](clone_id.md)
 * [code_repository](code_repository.md)
 * [concentration](concentration.md)
 * [conforms_to](conforms_to.md)
 * [conjugate](conjugate.md)
 * [➞data](container__data.md)
 * [➞iri](container__iri.md)
 * [➞metadata](container__metadata.md)
 * [core_antibody_panel](core_antibody_panel.md)
 * [create_date](create_date.md)
 * [created_by](created_by.md)
 * [creation_date](creation_date.md)
 * [creator_name](creator_name.md)
 * [creators](creators.md)
 * [cycle_number](cycle_number.md)
 * [cycles](cycles.md)
 * [datatable](datatable.md)
 * [derived_from](derived_from.md)
 * [description](description.md)
 * [detects](detects.md)
 * [dilution](dilution.md)
 * [distributions](distributions.md)
 * [doi](doi.md)
 * [downloadUrl](downloadUrl.md)
 * [experiment](experiment.md)
 * [externalReviewers](externalReviewers.md)
 * [firstName](firstName.md)
 * [fluorescent](fluorescent.md)
 * [fullName](fullName.md)
 * [funder](funder.md)
 * [funders](funders.md)
 * [had_member](had_member.md)
 * [has_antibody_component](has_antibody_component.md)
 * [has_cycle](has_cycle.md)
 * [host](host.md)
 * [hubmapId](hubmapId.md)
 * [id](id.md)
     * [AnatomicalStructure➞id](AnatomicalStructure_id.md)
     * [Antibody➞id](Antibody_id.md)
     * [Protein➞id](Protein_id.md)
 * [is_core_panel](is_core_panel.md)
 * [isotype](isotype.md)
 * [label](label.md)
 * [lastName](lastName.md)
 * [license](license.md)
 * [lot_number](lot_number.md)
 * [mediaType](mediaType.md)
 * [method](method.md)
 * [name](name.md)
 * [orcid](orcid.md)
 * [parent_class](parent_class.md)
 * [pref_label](pref_label.md)
 * [producer](producer.md)
 * [project_leads](project_leads.md)
 * [propertyId](propertyId.md)
 * [protein_id](protein_id.md)
 * [protocol_doi](protocol_doi.md)
     * [MultiplexedAntibodyBasedImagingExperiment➞protocol_doi](MultiplexedAntibodyBasedImagingExperiment_protocol_doi.md)
 * [publisher](publisher.md)
 * [rationale](rationale.md)
 * [recombinant](recombinant.md)
 * [references](references.md)
 * [reviewers](reviewers.md)
 * [sample_organ](sample_organ.md)
 * [see_also](see_also.md)
 * [target_product](target_product.md)
 * [tissue_preservation](tissue_preservation.md)
 * [title](title.md)
 * [type](type.md)
 * [type_of](type_of.md)
 * [used_by_experiment](used_by_experiment.md)
 * [uses_antibody](uses_antibody.md)
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
