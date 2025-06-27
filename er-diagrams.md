# HRA DO Processor Diagrams
## 2d-ftu

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
FtuIllustration {
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
FtuIllustrationNode {
    string node_name  
    string node_group  
    string part_of_illustration  
    uriorcurie id  
    string label  
}
FtuIllustrationFile {
    uri file_url  
    string file_format  
    uriorcurie id  
    string label  
}
AnatomicalStructureID {
    uriorcurie id  
}
FtuMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o FtuMetadata : "metadata"
Container ||--}o FtuIllustration : "data"
FtuIllustration ||--|o AnatomicalStructureID : "located_in"
FtuIllustration ||--}o FtuIllustrationFile : "image_file"
FtuIllustration ||--}o FtuIllustrationNode : "illustration_node"
FtuIllustration ||--|o Named : "representation_of"
FtuIllustration ||--}o Named : "type_of"
FtuIllustrationNode ||--|o Named : "representation_of"
FtuIllustrationNode ||--}o Named : "type_of"
FtuIllustrationFile ||--}o Named : "type_of"
FtuMetadata ||--}o Named : "created_by"
FtuMetadata ||--|o Named : "see_also"
FtuMetadata ||--|o Named : "derived_from"

```


## asct-b

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
AsctbDataset {

}
CellMarkerDescriptor {
    stringList references  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
AsctbRecord {
    integer record_number  
    stringList references  
    uriorcurie id  
    string label  
}
BiomarkerRecord {
    string ccf_pref_label  
    string ccf_biomarker_type  
    integer record_number  
    integer order_number  
    uriorcurie id  
    string label  
}
AsctbConcept {
    uriorcurie id  
    string label  
    string conforms_to  
    uriorcurie parent_class  
    string ccf_pref_label  
    string ccf_asctb_type  
    boolean ccf_is_provisional  
}
CellTypeRecord {
    string ccf_pref_label  
    integer record_number  
    integer order_number  
    uriorcurie id  
    string label  
}
AnatomicalStructureRecord {
    string ccf_pref_label  
    integer record_number  
    integer order_number  
    uriorcurie id  
    string label  
}
Biomarker {
    string ccf_biomarker_type  
    uriorcurie id  
    string label  
    string conforms_to  
    uriorcurie parent_class  
    string ccf_pref_label  
    string ccf_asctb_type  
    boolean ccf_is_provisional  
}
AnatomicalStructure {
    uriorcurie id  
    string label  
    string conforms_to  
    uriorcurie parent_class  
    string ccf_pref_label  
    string ccf_asctb_type  
    boolean ccf_is_provisional  
}
CellType {
    uriorcurie id  
    string label  
    string conforms_to  
    uriorcurie parent_class  
    string ccf_pref_label  
    string ccf_asctb_type  
    boolean ccf_is_provisional  
}
CharacterizingMarkerSet {
    stringList references  
}
AsctbMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o AsctbMetadata : "metadata"
Container ||--|o AsctbDataset : "data"
AsctbDataset ||--}o AnatomicalStructure : "anatomical_structures"
AsctbDataset ||--}o CellType : "cell_types"
AsctbDataset ||--}o Biomarker : "biomarkers"
AsctbDataset ||--}o AsctbRecord : "asctb_record"
AsctbDataset ||--}o CellMarkerDescriptor : "cell_marker_descriptor"
CellMarkerDescriptor ||--|| CellType : "primary_cell_type"
CellMarkerDescriptor ||--|| AnatomicalStructure : "primary_anatomical_structure"
CellMarkerDescriptor ||--}o Biomarker : "biomarker_set"
CellMarkerDescriptor ||--|o AsctbRecord : "source_record"
CellMarkerDescriptor ||--}o Named : "type_of"
AsctbRecord ||--}o AnatomicalStructureRecord : "anatomical_structure_list"
AsctbRecord ||--}o CellTypeRecord : "cell_type_list"
AsctbRecord ||--}o BiomarkerRecord : "gene_marker_list"
AsctbRecord ||--}o BiomarkerRecord : "protein_marker_list"
AsctbRecord ||--}o BiomarkerRecord : "lipid_marker_list"
AsctbRecord ||--}o BiomarkerRecord : "metabolites_marker_list"
AsctbRecord ||--}o BiomarkerRecord : "proteoforms_marker_list"
AsctbRecord ||--}o Named : "type_of"
BiomarkerRecord ||--|| AsctbConcept : "source_concept"
BiomarkerRecord ||--}o Named : "type_of"
CellTypeRecord ||--|| AsctbConcept : "source_concept"
CellTypeRecord ||--}o Named : "type_of"
AnatomicalStructureRecord ||--|| AsctbConcept : "source_concept"
AnatomicalStructureRecord ||--}o Named : "type_of"
AnatomicalStructure ||--}o AnatomicalStructure : "ccf_part_of"
CellType ||--}o CellType : "ccf_ct_isa"
CellType ||--}o AnatomicalStructure : "ccf_located_in"
CellType ||--}o CharacterizingMarkerSet : "has_characterizing_marker_set"
CharacterizingMarkerSet ||--}o Biomarker : "members"
AsctbMetadata ||--}o Named : "created_by"
AsctbMetadata ||--|o Named : "see_also"
AsctbMetadata ||--|o Named : "derived_from"

```


## basic

```mermaid
erDiagram
Container {
    uriorcurie iri  
    stringList data  
}
BasicMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}
Named {
    uriorcurie id  
    string label  
}

Container ||--|o BasicMetadata : "metadata"
BasicMetadata ||--}o Named : "created_by"
BasicMetadata ||--|o Named : "see_also"
BasicMetadata ||--|o Named : "derived_from"

```


## cell-summary

```mermaid
erDiagram
CellSummary {
    string annotation_method  
    decimal aggregated_summary_count  
    string modality  
    string sex  
}
CellSummaryRow {
    string cell_label  
    integer count  
    decimal percentage  
}
CellID {
    uriorcurie id  
}
GeneExpression {
    string gene_label  
    string ensembl_id  
    decimal mean_gene_expr_value  
}
GeneID {
    uriorcurie id  
}
EntityID {
    uriorcurie id  
}
Named {
    uriorcurie id  
    string label  
}
Instance {

}
ProvEntity {
    uriorcurie id  
    string label  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}
Person {
    string fullName  
    string firstName  
    string lastName  
    string orcid  
    string conforms_to  
    uriorcurie id  
    string label  
}
SoftwareApplication {
    string name  
    string version  
    string conforms_to  
    uriorcurie id  
    string label  
}
SoftwareSourceCode {

}
Grant {
    string funder  
    string awardNumber  
}
Distribution {
    string title  
    uri downloadUrl  
    uri accessUrl  
    string mediaType  
    uriorcurie id  
    string label  
}
RawDataset {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
    stringList references  
    string citation  
    string citationOverall  
    string hubmapId  
    uriorcurie id  
    string label  
}

CellSummary ||--}o EntityID : "aggregated_summaries"
CellSummary ||--}| CellSummaryRow : "summary"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--|| CellID : "cell_id"
CellSummaryRow ||--}o GeneExpression : "gene_expr"
CellSummaryRow ||--}o Named : "type_of"
GeneExpression ||--|| GeneID : "gene_id"
GeneExpression ||--}o Named : "type_of"
Instance ||--}o Named : "type_of"
ProvEntity ||--|o RawDataset : "was_derived_from"
Person ||--}o Named : "type_of"
SoftwareApplication ||--|o SoftwareSourceCode : "target_product"
SoftwareApplication ||--}o Named : "type_of"
SoftwareSourceCode ||--|o Named : "code_repository"
SoftwareSourceCode ||--|o Named : "see_also"
RawDataset ||--}o Creator : "creators"
RawDataset ||--}o Person : "reviewers"
RawDataset ||--|o Named : "see_also"
RawDataset ||--}o Grant : "funders"
RawDataset ||--|o Named : "doi"
RawDataset ||--}o Person : "project_leads"
RawDataset ||--}o Person : "externalReviewers"
RawDataset ||--}o Distribution : "distributions"
RawDataset ||--|o RawDataset : "was_derived_from"

```


## collection

```mermaid
erDiagram
Container {
    uriorcurie iri  
    stringList data  
}
CollectionMetadata {
    string title  
    string description  
    string version  
    date creation_date  
    string license  
    string publisher  
}
Named {
    uriorcurie id  
    string label  
}

Container ||--|o CollectionMetadata : "metadata"
CollectionMetadata ||--}o Named : "created_by"
CollectionMetadata ||--|o Named : "see_also"
CollectionMetadata ||--|o Named : "derived_from"
CollectionMetadata ||--}o Named : "had_member"
CollectionMetadata ||--}o Named : "ontology_root"

```


## collision

```mermaid
erDiagram
CollisionSummary {
    string collision_method  
}
CollisionItem {
    string as_label  
    decimal as_volume  
    decimal percentage  
}
AnatomicalStructureObject {
    string anatomical_structure_label  
    decimal anatomical_structure_volume  
}
EntityID {
    uriorcurie id  
}
Named {
    uriorcurie id  
    string label  
}
Instance {

}
ProvEntity {
    uriorcurie id  
    string label  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}
Person {
    string fullName  
    string firstName  
    string lastName  
    string orcid  
    string conforms_to  
    uriorcurie id  
    string label  
}
SoftwareApplication {
    string name  
    string version  
    string conforms_to  
    uriorcurie id  
    string label  
}
SoftwareSourceCode {

}
Grant {
    string funder  
    string awardNumber  
}
Distribution {
    string title  
    uri downloadUrl  
    uri accessUrl  
    string mediaType  
    uriorcurie id  
    string label  
}
RawDataset {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
    stringList references  
    string citation  
    string citationOverall  
    string hubmapId  
    uriorcurie id  
    string label  
}

CollisionSummary ||--}o CollisionItem : "collisions"
CollisionSummary ||--}o Named : "type_of"
CollisionItem ||--|o EntityID : "reference_organ"
CollisionItem ||--|| EntityID : "as_3d_id"
CollisionItem ||--|| EntityID : "as_id"
CollisionItem ||--|o AnatomicalStructureObject : "collides_with_object"
CollisionItem ||--}o Named : "type_of"
AnatomicalStructureObject ||--|| EntityID : "anatomical_structure_id"
AnatomicalStructureObject ||--|| EntityID : "object_reference_id"
AnatomicalStructureObject ||--|| EntityID : "spatial_entity_id"
AnatomicalStructureObject ||--}o Named : "type_of"
Instance ||--}o Named : "type_of"
ProvEntity ||--|o RawDataset : "was_derived_from"
Person ||--}o Named : "type_of"
SoftwareApplication ||--|o SoftwareSourceCode : "target_product"
SoftwareApplication ||--}o Named : "type_of"
SoftwareSourceCode ||--|o Named : "code_repository"
SoftwareSourceCode ||--|o Named : "see_also"
RawDataset ||--}o Creator : "creators"
RawDataset ||--}o Person : "reviewers"
RawDataset ||--|o Named : "see_also"
RawDataset ||--}o Grant : "funders"
RawDataset ||--|o Named : "doi"
RawDataset ||--}o Person : "project_leads"
RawDataset ||--}o Person : "externalReviewers"
RawDataset ||--}o Distribution : "distributions"
RawDataset ||--|o RawDataset : "was_derived_from"

```


## corridor

```mermaid
erDiagram
Corridor {
    string file_format  
    string file  
}
EntityID {
    uriorcurie id  
}
Named {
    uriorcurie id  
    string label  
}
Instance {

}
ProvEntity {
    uriorcurie id  
    string label  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}
Person {
    string fullName  
    string firstName  
    string lastName  
    string orcid  
    string conforms_to  
    uriorcurie id  
    string label  
}
SoftwareApplication {
    string name  
    string version  
    string conforms_to  
    uriorcurie id  
    string label  
}
SoftwareSourceCode {

}
Grant {
    string funder  
    string awardNumber  
}
Distribution {
    string title  
    uri downloadUrl  
    uri accessUrl  
    string mediaType  
    uriorcurie id  
    string label  
}
RawDataset {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
    stringList references  
    string citation  
    string citationOverall  
    string hubmapId  
    uriorcurie id  
    string label  
}

Corridor ||--}o Named : "type_of"
Instance ||--}o Named : "type_of"
ProvEntity ||--|o RawDataset : "was_derived_from"
Person ||--}o Named : "type_of"
SoftwareApplication ||--|o SoftwareSourceCode : "target_product"
SoftwareApplication ||--}o Named : "type_of"
SoftwareSourceCode ||--|o Named : "code_repository"
SoftwareSourceCode ||--|o Named : "see_also"
RawDataset ||--}o Creator : "creators"
RawDataset ||--}o Person : "reviewers"
RawDataset ||--|o Named : "see_also"
RawDataset ||--}o Grant : "funders"
RawDataset ||--|o Named : "doi"
RawDataset ||--}o Person : "project_leads"
RawDataset ||--}o Person : "externalReviewers"
RawDataset ||--}o Distribution : "distributions"
RawDataset ||--|o RawDataset : "was_derived_from"

```


## ctann

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
CtAnnMappingSet {
    uriorcurie id  
    string label  
    uri mapping_set_id  
    string mapping_set_version  
    uriList mapping_set_source  
    string mapping_set_title  
    string mapping_set_description  
    EntityReferenceList creator_id  
    stringList creator_label  
    string license  
    entity_type_enum subject_type  
    EntityReference subject_source  
    string subject_source_version  
    entity_type_enum object_type  
    EntityReference object_source  
    string object_source_version  
    entity_type_enum predicate_type  
    uri mapping_provider  
    string mapping_tool  
    string mapping_tool_version  
    date mapping_date  
    date publication_date  
    EntityReferenceList subject_match_field  
    EntityReferenceList object_match_field  
    EntityReferenceList subject_preprocessing  
    EntityReferenceList object_preprocessing  
    uri issue_tracker  
    string other  
    string comment  
}
Named {
    uriorcurie id  
    string label  
}
Prefix {
    ncname prefix_name  
    uri prefix_url  
}
CtAnnExtensionDefinition {
    uriorcurie id  
    string label  
    ncname slot_name  
    uriorcurie property  
    uriorcurie type_hint  
}
CtAnnMapping {
    uriorcurie id  
    string label  
    string ext_organ_level  
    EntityReference subject_id  
    string subject_label  
    string subject_category  
    EntityReference predicate_id  
    string predicate_label  
    predicate_modifier_enum predicate_modifier  
    EntityReference object_id  
    string object_label  
    string object_category  
    EntityReference mapping_justification  
    EntityReferenceList author_id  
    stringList author_label  
    EntityReferenceList reviewer_id  
    stringList reviewer_label  
    EntityReferenceList creator_id  
    stringList creator_label  
    string license  
    entity_type_enum subject_type  
    EntityReference subject_source  
    string subject_source_version  
    entity_type_enum object_type  
    EntityReference object_source  
    string object_source_version  
    entity_type_enum predicate_type  
    uri mapping_provider  
    EntityReference mapping_source  
    mapping_cardinality_enum mapping_cardinality  
    string mapping_tool  
    string mapping_tool_version  
    date mapping_date  
    date publication_date  
    double confidence  
    EntityReferenceList curation_rule  
    stringList curation_rule_text  
    EntityReferenceList subject_match_field  
    EntityReferenceList object_match_field  
    stringList match_string  
    EntityReferenceList subject_preprocessing  
    EntityReferenceList object_preprocessing  
    double similarity_score  
    string similarity_measure  
    EntityReference issue_tracker_item  
    string other  
    string comment  
}
AnatomicalStructureID {
    uriorcurie id  
}
CtAnnMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o CtAnnMetadata : "metadata"
Container ||--|o CtAnnMappingSet : "data"
CtAnnMappingSet ||--}o Named : "type_of"
CtAnnMappingSet ||--}o CtAnnMapping : "mappings"
CtAnnMappingSet ||--}o CtAnnExtensionDefinition : "extension_definitions"
CtAnnMappingSet ||--}o Prefix : "curie_map"
CtAnnMappingSet ||--|o Named : "see_also"
CtAnnExtensionDefinition ||--}o Named : "type_of"
CtAnnMapping ||--}o Named : "type_of"
CtAnnMapping ||--|o AnatomicalStructureID : "ext_organ_id"
CtAnnMapping ||--|o Named : "see_also"
CtAnnMetadata ||--}o Named : "created_by"
CtAnnMetadata ||--|o Named : "see_also"
CtAnnMetadata ||--|o Named : "derived_from"

```


## dataset

```mermaid
erDiagram
Container {
    string iri  
    string metadata  
}
AssayDatasetData {
    string donor_record  
    string sample_record  
    string spatial_entity_record  
    string spatial_placement_record  
}
Dataset {
    string pref_label  
    string description  
    string link  
    string technology  
    integer cell_count  
    integer gene_count  
    string thumbnail  
    uriorcurie publication  
    string publication_title  
    string publication_lead_author  
    stringList references  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
CellSummary {
    string annotation_method  
    decimal aggregated_summary_count  
    string modality  
    string sex  
}
CellSummaryRow {
    string cell_label  
    integer count  
    decimal percentage  
}
GeneExpression {
    string gene_label  
    string ensembl_id  
    decimal mean_gene_expr_value  
}
GeneID {
    uriorcurie id  
}
CellID {
    uriorcurie id  
}
EntityID {
    uriorcurie id  
}

Container ||--|o AssayDatasetData : "data"
AssayDatasetData ||--}o Dataset : "dataset_record"
Dataset ||--|o EntityID : "organ_id"
Dataset ||--}o CellSummary : "summaries"
Dataset ||--}o Named : "type_of"
CellSummary ||--}o EntityID : "aggregated_summaries"
CellSummary ||--}| CellSummaryRow : "summary"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--|| CellID : "cell_id"
CellSummaryRow ||--}o GeneExpression : "gene_expr"
CellSummaryRow ||--}o Named : "type_of"
GeneExpression ||--|| GeneID : "gene_id"
GeneExpression ||--}o Named : "type_of"

```


## donor

```mermaid
erDiagram
Container {
    string iri  
    string metadata  
}
DonorData {
    string sample_record  
    string dataset_record  
    string spatial_entity_record  
    string spatial_placement_record  
}
Donor {
    string pref_label  
    string description  
    string link  
    decimal age  
    decimal bmi  
    string sex  
    string race  
    string consortium_name  
    string provider_name  
    string provider_uuid  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}

Container ||--|o DonorData : "data"
DonorData ||--}o Donor : "donor_record"
Donor ||--|o Named : "sex_id"
Donor ||--|o Named : "race_id"
Donor ||--}o Named : "type_of"

```


## ds-graph

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
DatasetGraphData {

}
SpatialPlacement {
    string pref_label  
    date placement_date  
    decimal x_scaling  
    decimal y_scaling  
    decimal z_scaling  
    string scaling_unit  
    decimal x_rotation  
    decimal y_rotation  
    decimal z_rotation  
    string rotation_unit  
    string rotation_order  
    decimal x_translation  
    decimal y_translation  
    decimal z_translation  
    string translation_unit  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
SpatialEntity {
    string pref_label  
    string creator_first_name  
    string creator_last_name  
    string creator_name  
    date create_date  
    decimal x_dimension  
    decimal y_dimension  
    decimal z_dimension  
    string dimension_unit  
    integer slice_count  
    decimal slice_thickness  
    uriorcurie id  
    string label  
}
CellSummary {
    string annotation_method  
    decimal aggregated_summary_count  
    string modality  
    string sex  
}
CellSummaryRow {
    string cell_label  
    integer count  
    decimal percentage  
}
GeneExpression {
    string gene_label  
    string ensembl_id  
    decimal mean_gene_expr_value  
}
GeneID {
    uriorcurie id  
}
CellID {
    uriorcurie id  
}
EntityID {
    uriorcurie id  
}
Corridor {
    string file_format  
    string file  
}
CollisionSummary {
    string collision_method  
}
CollisionItem {
    string as_label  
    decimal as_volume  
    decimal percentage  
}
AnatomicalStructureObject {
    string anatomical_structure_label  
    decimal anatomical_structure_volume  
}
Dataset {
    string pref_label  
    string description  
    string link  
    string technology  
    integer cell_count  
    integer gene_count  
    string thumbnail  
    uriorcurie publication  
    string publication_title  
    string publication_lead_author  
    stringList references  
    uriorcurie id  
    string label  
}
TissueBlock {
    string pref_label  
    string description  
    SampleTypeEnum sample_type  
    string link  
    integer section_count  
    decimal section_size  
    string section_units  
    uriorcurie id  
    string label  
}
TissueSection {
    string pref_label  
    string description  
    SampleTypeEnum sample_type  
    string link  
    integer section_number  
    uriorcurie id  
    string label  
}
Donor {
    string pref_label  
    string description  
    string link  
    decimal age  
    decimal bmi  
    string sex  
    string race  
    string consortium_name  
    string provider_name  
    string provider_uuid  
    uriorcurie id  
    string label  
}
DatasetGraphMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o DatasetGraphMetadata : "metadata"
Container ||--|o DatasetGraphData : "data"
DatasetGraphData ||--}o Donor : "donor_record"
DatasetGraphData ||--}o TissueBlock : "sample_record"
DatasetGraphData ||--}o Dataset : "dataset_record"
DatasetGraphData ||--}o SpatialEntity : "spatial_entity_record"
DatasetGraphData ||--}o SpatialPlacement : "spatial_placement_record"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--}o Named : "type_of"
SpatialEntity ||--}o EntityID : "collides_with"
SpatialEntity ||--}o CollisionSummary : "all_collisions"
SpatialEntity ||--|o Corridor : "corridor"
SpatialEntity ||--}o CellSummary : "summaries"
SpatialEntity ||--}o Named : "type_of"
CellSummary ||--}o EntityID : "aggregated_summaries"
CellSummary ||--}| CellSummaryRow : "summary"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--|| CellID : "cell_id"
CellSummaryRow ||--}o GeneExpression : "gene_expr"
CellSummaryRow ||--}o Named : "type_of"
GeneExpression ||--|| GeneID : "gene_id"
GeneExpression ||--}o Named : "type_of"
Corridor ||--}o Named : "type_of"
CollisionSummary ||--}o CollisionItem : "collisions"
CollisionSummary ||--}o Named : "type_of"
CollisionItem ||--|o EntityID : "reference_organ"
CollisionItem ||--|| EntityID : "as_3d_id"
CollisionItem ||--|| EntityID : "as_id"
CollisionItem ||--|o AnatomicalStructureObject : "collides_with_object"
CollisionItem ||--}o Named : "type_of"
AnatomicalStructureObject ||--|| EntityID : "anatomical_structure_id"
AnatomicalStructureObject ||--|| EntityID : "object_reference_id"
AnatomicalStructureObject ||--|| EntityID : "spatial_entity_id"
AnatomicalStructureObject ||--}o Named : "type_of"
Dataset ||--|o EntityID : "organ_id"
Dataset ||--}o CellSummary : "summaries"
Dataset ||--}o Named : "type_of"
TissueBlock ||--|o EntityID : "rui_location"
TissueBlock ||--}o TissueSection : "sections"
TissueBlock ||--}o EntityID : "datasets"
TissueBlock ||--|| EntityID : "donor"
TissueBlock ||--}o Named : "type_of"
TissueSection ||--}o EntityID : "datasets"
TissueSection ||--}o Named : "type_of"
Donor ||--|o Named : "sex_id"
Donor ||--|o Named : "race_id"
Donor ||--}o Named : "type_of"
DatasetGraphMetadata ||--}o Named : "created_by"
DatasetGraphMetadata ||--|o Named : "see_also"
DatasetGraphMetadata ||--|o Named : "derived_from"

```


## graph

```mermaid
erDiagram
Container {
    uriorcurie iri  
    stringList data  
}
GraphMetadata {
    string title  
    string description  
    string version  
    date creation_date  
    string license  
    string publisher  
}
Named {
    uriorcurie id  
    string label  
}

Container ||--|o GraphMetadata : "metadata"
GraphMetadata ||--}o Named : "created_by"
GraphMetadata ||--|o Named : "see_also"
GraphMetadata ||--|o Named : "derived_from"

```


## landmark

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
LandmarkData {

}
SpatialEntity {
    string pref_label  
    decimal x_dimension  
    decimal y_dimension  
    decimal z_dimension  
    string dimension_unit  
    integer rui_rank  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
ExtractionSet {
    string pref_label  
    integer rui_rank  
    uriorcurie id  
    string label  
}
SpatialPlacement {
    decimal x_scaling  
    decimal y_scaling  
    decimal z_scaling  
    string scaling_unit  
    decimal x_rotation  
    decimal y_rotation  
    decimal z_rotation  
    string rotation_unit  
    string rotation_order  
    decimal x_translation  
    decimal y_translation  
    decimal z_translation  
    string translation_unit  
    uriorcurie id  
    string label  
}
SpatialObjectReference {
    string file_name  
    string file_url  
    string file_subpath  
    string file_format  
    uriorcurie id  
    string label  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}
LandmarkMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o LandmarkMetadata : "metadata"
Container ||--|o LandmarkData : "data"
LandmarkData ||--}| ExtractionSet : "landmarks"
LandmarkData ||--}| SpatialEntity : "spatial_entities"
SpatialEntity ||--}o Creator : "creators"
SpatialEntity ||--|o SpatialObjectReference : "object_reference"
SpatialEntity ||--}o SpatialPlacement : "placements"
SpatialEntity ||--|| ExtractionSet : "extraction_set"
SpatialEntity ||--}o Named : "type_of"
ExtractionSet ||--|| SpatialEntity : "extraction_set_for"
ExtractionSet ||--}o Named : "type_of"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--}o Named : "type_of"
SpatialObjectReference ||--|| SpatialPlacement : "placement"
SpatialObjectReference ||--}o Named : "type_of"
LandmarkMetadata ||--}o Named : "created_by"
LandmarkMetadata ||--|o Named : "see_also"
LandmarkMetadata ||--|o Named : "derived_from"

```


## omap

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
OmapDataset {

}
AntibodyPanel {
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
ExperimentUsedAntibody {
    decimal concentration  
    integer dilution  
    integer cycle_number  
    boolean is_core_panel  
    uriorcurie id  
    string label  
}
RegisteredAntibody {
    string lot_number  
    uriorcurie id  
    string label  
}
MultiplexedAntibodyBasedImagingExperiment {
    string study_method  
    string tissue_preservation  
    uriorcurie id  
    string label  
}
AnatomicalStructure {
    uriorcurie id  
}
ExperimentCycle {
    integer cycle_number  
    uriorcurie id  
    string label  
}
Antibody {
    uriorcurie id  
    uriorcurie parent_class  
    string antibody_type  
    string host  
    string isotype  
    string clonality  
    string clone_id  
    string conjugate  
    string fluorescent  
    string recombinant  
    string producer  
    string catalog_number  
}
BindsToStatement {
    string rationale  
}
DetectStatement {
    string rationale  
}
Protein {
    uriorcurie id  
}
OmapMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o OmapMetadata : "metadata"
Container ||--|o OmapDataset : "data"
OmapDataset ||--}| Antibody : "antibody"
OmapDataset ||--|| MultiplexedAntibodyBasedImagingExperiment : "experiment"
OmapDataset ||--}| ExperimentCycle : "cycles"
OmapDataset ||--|| AntibodyPanel : "antibody_panel"
AntibodyPanel ||--}| ExperimentUsedAntibody : "contains_antibodies"
AntibodyPanel ||--}o Named : "type_of"
ExperimentUsedAntibody ||--|| MultiplexedAntibodyBasedImagingExperiment : "used_by_experiment"
ExperimentUsedAntibody ||--|| RegisteredAntibody : "based_on"
ExperimentUsedAntibody ||--}o Named : "type_of"
RegisteredAntibody ||--}o Named : "type_of"
MultiplexedAntibodyBasedImagingExperiment ||--}o Named : "protocol_doi"
MultiplexedAntibodyBasedImagingExperiment ||--}o Named : "author_orcid"
MultiplexedAntibodyBasedImagingExperiment ||--}| ExperimentCycle : "has_cycle"
MultiplexedAntibodyBasedImagingExperiment ||--|| AnatomicalStructure : "sample_organ"
MultiplexedAntibodyBasedImagingExperiment ||--}o Named : "type_of"
ExperimentCycle ||--}| ExperimentUsedAntibody : "uses_antibodies"
ExperimentCycle ||--}o Named : "type_of"
Antibody ||--}o DetectStatement : "detects"
Antibody ||--}o BindsToStatement : "binds_to"
BindsToStatement ||--|| Antibody : "antibody_id"
DetectStatement ||--}| Protein : "protein_id"
OmapMetadata ||--}o Named : "created_by"
OmapMetadata ||--|o Named : "see_also"
OmapMetadata ||--|o Named : "derived_from"

```


## ref-organ

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
SpatialEntity {
    string pref_label  
    date create_date  
    decimal x_dimension  
    decimal y_dimension  
    decimal z_dimension  
    string dimension_unit  
    string organ_owner_sex  
    string organ_side  
    integer rui_rank  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
ExtractionSet {
    integer rui_rank  
    uriorcurie id  
    string label  
}
SpatialPlacement {
    string pref_label  
    date placement_date  
    decimal x_scaling  
    decimal y_scaling  
    decimal z_scaling  
    string scaling_unit  
    decimal x_rotation  
    decimal y_rotation  
    decimal z_rotation  
    string rotation_unit  
    string rotation_order  
    decimal x_translation  
    decimal y_translation  
    decimal z_translation  
    string translation_unit  
    uriorcurie id  
    string label  
}
SpatialObjectReference {
    string file_name  
    string file_url  
    string file_subpath  
    string file_format  
    uriorcurie id  
    string label  
}
AnatomicalStructure {
    uriorcurie id  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}
RefOrganMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o RefOrganMetadata : "metadata"
Container ||--}o SpatialEntity : "data"
SpatialEntity ||--}o Creator : "creators"
SpatialEntity ||--|o AnatomicalStructure : "representation_of"
SpatialEntity ||--|o SpatialObjectReference : "object_reference"
SpatialEntity ||--}o SpatialPlacement : "placements"
SpatialEntity ||--|o SpatialEntity : "reference_organ"
SpatialEntity ||--|o ExtractionSet : "extraction_set"
SpatialEntity ||--}o Named : "type_of"
ExtractionSet ||--|| SpatialEntity : "extraction_set_for"
ExtractionSet ||--}o Named : "type_of"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--}o Named : "type_of"
SpatialObjectReference ||--|| SpatialPlacement : "placement"
SpatialObjectReference ||--}o Named : "type_of"
RefOrganMetadata ||--}o Named : "created_by"
RefOrganMetadata ||--|o Named : "see_also"
RefOrganMetadata ||--|o Named : "derived_from"

```


## sample

```mermaid
erDiagram
Container {
    string iri  
    string metadata  
}
SampleData {
    string donor_record  
    string dataset_record  
    string spatial_entity_record  
    string spatial_placement_record  
}
TissueBlock {
    string pref_label  
    string description  
    SampleTypeEnum sample_type  
    string link  
    integer section_count  
    decimal section_size  
    string section_units  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
EntityID {
    uriorcurie id  
}
TissueSection {
    string pref_label  
    string description  
    SampleTypeEnum sample_type  
    string link  
    integer section_number  
    uriorcurie id  
    string label  
}

Container ||--|o SampleData : "data"
SampleData ||--}o TissueBlock : "sample_record"
TissueBlock ||--|o EntityID : "rui_location"
TissueBlock ||--}o TissueSection : "sections"
TissueBlock ||--}o EntityID : "datasets"
TissueBlock ||--|| EntityID : "donor"
TissueBlock ||--}o Named : "type_of"
TissueSection ||--}o EntityID : "datasets"
TissueSection ||--}o Named : "type_of"

```


## spatial

```mermaid
erDiagram
Container {
    string iri  
    string metadata  
}
SpatialData {
    string donor_record  
    string sample_record  
    string dataset_record  
}
SpatialPlacement {
    string pref_label  
    date placement_date  
    decimal x_scaling  
    decimal y_scaling  
    decimal z_scaling  
    string scaling_unit  
    decimal x_rotation  
    decimal y_rotation  
    decimal z_rotation  
    string rotation_unit  
    string rotation_order  
    decimal x_translation  
    decimal y_translation  
    decimal z_translation  
    string translation_unit  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
SpatialEntity {
    string pref_label  
    string creator_first_name  
    string creator_last_name  
    string creator_name  
    date create_date  
    decimal x_dimension  
    decimal y_dimension  
    decimal z_dimension  
    string dimension_unit  
    integer slice_count  
    decimal slice_thickness  
    uriorcurie id  
    string label  
}
CellSummary {
    string annotation_method  
    decimal aggregated_summary_count  
    string modality  
    string sex  
}
CellSummaryRow {
    string cell_label  
    integer count  
    decimal percentage  
}
GeneExpression {
    string gene_label  
    string ensembl_id  
    decimal mean_gene_expr_value  
}
GeneID {
    uriorcurie id  
}
CellID {
    uriorcurie id  
}
EntityID {
    uriorcurie id  
}
Corridor {
    string file_format  
    string file  
}
CollisionSummary {
    string collision_method  
}
CollisionItem {
    string as_label  
    decimal as_volume  
    decimal percentage  
}
AnatomicalStructureObject {
    string anatomical_structure_label  
    decimal anatomical_structure_volume  
}

Container ||--|o SpatialData : "data"
SpatialData ||--}o SpatialEntity : "spatial_entity_record"
SpatialData ||--}o SpatialPlacement : "spatial_placement_record"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--}o Named : "type_of"
SpatialEntity ||--}o EntityID : "collides_with"
SpatialEntity ||--}o CollisionSummary : "all_collisions"
SpatialEntity ||--|o Corridor : "corridor"
SpatialEntity ||--}o CellSummary : "summaries"
SpatialEntity ||--}o Named : "type_of"
CellSummary ||--}o EntityID : "aggregated_summaries"
CellSummary ||--}| CellSummaryRow : "summary"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--|| CellID : "cell_id"
CellSummaryRow ||--}o GeneExpression : "gene_expr"
CellSummaryRow ||--}o Named : "type_of"
GeneExpression ||--|| GeneID : "gene_id"
GeneExpression ||--}o Named : "type_of"
Corridor ||--}o Named : "type_of"
CollisionSummary ||--}o CollisionItem : "collisions"
CollisionSummary ||--}o Named : "type_of"
CollisionItem ||--|o EntityID : "reference_organ"
CollisionItem ||--|| EntityID : "as_3d_id"
CollisionItem ||--|| EntityID : "as_id"
CollisionItem ||--|o AnatomicalStructureObject : "collides_with_object"
CollisionItem ||--}o Named : "type_of"
AnatomicalStructureObject ||--|| EntityID : "anatomical_structure_id"
AnatomicalStructureObject ||--|| EntityID : "object_reference_id"
AnatomicalStructureObject ||--|| EntityID : "spatial_entity_id"
AnatomicalStructureObject ||--}o Named : "type_of"

```


## sssom

```mermaid
erDiagram
MappingSet {
    uri mapping_set_id  
    string mapping_set_version  
    uriList mapping_set_source  
    string mapping_set_title  
    string mapping_set_description  
    EntityReferenceList creator_id  
    stringList creator_label  
    uri license  
    entity_type_enum subject_type  
    EntityReference subject_source  
    string subject_source_version  
    entity_type_enum object_type  
    EntityReference object_source  
    string object_source_version  
    entity_type_enum predicate_type  
    uri mapping_provider  
    string mapping_tool  
    string mapping_tool_version  
    date mapping_date  
    date publication_date  
    EntityReferenceList subject_match_field  
    EntityReferenceList object_match_field  
    EntityReferenceList subject_preprocessing  
    EntityReferenceList object_preprocessing  
    stringList see_also  
    uri issue_tracker  
    string other  
    string comment  
}
Mapping {
    EntityReference subject_id  
    string subject_label  
    string subject_category  
    EntityReference predicate_id  
    string predicate_label  
    predicate_modifier_enum predicate_modifier  
    EntityReference object_id  
    string object_label  
    string object_category  
    EntityReference mapping_justification  
    EntityReferenceList author_id  
    stringList author_label  
    EntityReferenceList reviewer_id  
    stringList reviewer_label  
    EntityReferenceList creator_id  
    stringList creator_label  
    uri license  
    entity_type_enum subject_type  
    EntityReference subject_source  
    string subject_source_version  
    entity_type_enum object_type  
    EntityReference object_source  
    string object_source_version  
    entity_type_enum predicate_type  
    uri mapping_provider  
    EntityReference mapping_source  
    mapping_cardinality_enum mapping_cardinality  
    string mapping_tool  
    string mapping_tool_version  
    date mapping_date  
    date publication_date  
    double confidence  
    EntityReferenceList curation_rule  
    stringList curation_rule_text  
    EntityReferenceList subject_match_field  
    EntityReferenceList object_match_field  
    stringList match_string  
    EntityReferenceList subject_preprocessing  
    EntityReferenceList object_preprocessing  
    double similarity_score  
    string similarity_measure  
    stringList see_also  
    EntityReference issue_tracker_item  
    string other  
    string comment  
}
MappingRegistry {
    EntityReference mapping_registry_id  
    string mapping_registry_title  
    string mapping_registry_description  
    uriList imports  
    uri documentation  
    uri homepage  
    uri issue_tracker  
}
MappingSetReference {
    uri mapping_set_id  
    uri mirror_from  
    double registry_confidence  
    string mapping_set_group  
    date last_updated  
    string local_name  
}
Prefix {
    ncname prefix_name  
    uri prefix_url  
}
ExtensionDefinition {
    ncname slot_name  
    uriorcurie property  
    uriorcurie type_hint  
}
Propagatable {
    boolean propagated  
}
NoTermFound {

}

MappingSet ||--}o Prefix : "curie_map"
MappingSet ||--}o Mapping : "mappings"
MappingSet ||--}o ExtensionDefinition : "extension_definitions"
MappingRegistry ||--}o MappingSetReference : "mapping_set_references"

```


## vocab

```mermaid
erDiagram
Container {
    uriorcurie iri  
    stringList data  
}
VocabMetadata {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
}
Named {
    uriorcurie id  
    string label  
}

Container ||--|o VocabMetadata : "metadata"
VocabMetadata ||--}o Named : "created_by"
VocabMetadata ||--|o Named : "see_also"
VocabMetadata ||--|o Named : "derived_from"

```


## basic-metadata

```mermaid
erDiagram
Container {
    string name  
    string type  
    string title  
    string description  
    string version  
    date creation_date  
    string publisher  
    stringList references  
    string license  
    uriorcurie id  
    string label  
}
RawDataset {
    string title  
    string description  
    date creation_date  
    string version  
    string license  
    string publisher  
    stringList references  
    string citation  
    string citationOverall  
    string hubmapId  
    uriorcurie id  
    string label  
}
Distribution {
    string title  
    uri downloadUrl  
    uri accessUrl  
    string mediaType  
    uriorcurie id  
    string label  
}
Person {
    string fullName  
    string firstName  
    string lastName  
    string orcid  
    string conforms_to  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
Grant {
    string funder  
    string awardNumber  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}

Container ||--}| Creator : "creators"
Container ||--|o Named : "see_also"
Container ||--}| Distribution : "distributions"
Container ||--|o RawDataset : "was_derived_from"
RawDataset ||--}o Creator : "creators"
RawDataset ||--}o Person : "reviewers"
RawDataset ||--|o Named : "see_also"
RawDataset ||--}o Grant : "funders"
RawDataset ||--|o Named : "doi"
RawDataset ||--}o Person : "project_leads"
RawDataset ||--}o Person : "externalReviewers"
RawDataset ||--}o Distribution : "distributions"
RawDataset ||--|o RawDataset : "was_derived_from"
Person ||--}o Named : "type_of"

```


