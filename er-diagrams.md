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
    string creation_date  
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
    string creation_date  
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
    string creation_date  
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
Container {
    string iri  
    string metadata  
}
CellSummaryData {
    string donor  
    string sample  
    string dataset  
    string spatial_entity  
    string collision  
    string corridor  
}
CellSummary {
    string annotation_method  
    uriorcurieList aggregated_summaries  
    string modality  
    string donor_sex  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
CellSummaryRow {
    string cell_label  
    integer count  
    float percentage  
    uriorcurie id  
    string label  
}
GeneExpression {
    string gene_label  
    string ensembl_id  
    float mean_gene_expression_value  
    uriorcurie id  
    string label  
}
GeneID {
    uriorcurie id  
}
CellID {
    uriorcurie id  
}

Container ||--|o CellSummaryData : "data"
CellSummaryData ||--}o CellSummary : "cell_summary"
CellSummary ||--}| CellSummaryRow : "summary_rows"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--|| CellID : "cell_id"
CellSummaryRow ||--}o GeneExpression : "gene_expressions"
CellSummaryRow ||--}o Named : "type_of"
GeneExpression ||--|| GeneID : "gene_id"
GeneExpression ||--}o Named : "type_of"

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
    string creation_date  
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
Container {
    uriorcurie iri  
}
CollisionData {
    string donor  
    string sample  
    string dataset  
    string spatial_entity  
    string cell_summary  
    string corridor  
}
CollisionSummary {
    string collision_method  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
CollisionItem {
    float volume  
    float percentage  
    uriorcurie id  
    string label  
}
SpatialEntityID {
    uriorcurie id  
}
CollisionMetadata {
    string title  
    string description  
    string creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o CollisionMetadata : "metadata"
Container ||--|o CollisionData : "data"
CollisionData ||--}o CollisionSummary : "collision"
CollisionSummary ||--}| CollisionItem : "collision_items"
CollisionSummary ||--}o Named : "type_of"
CollisionItem ||--|| SpatialEntityID : "spatial_entity_reference"
CollisionItem ||--}o Named : "type_of"
CollisionMetadata ||--}o Named : "created_by"
CollisionMetadata ||--|o Named : "see_also"
CollisionMetadata ||--|o Named : "derived_from"

```


## corridor

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
CorridorData {
    string donor  
    string sample  
    string dataset  
    string spatial_entity  
    string cell_summary  
    string collision  
}
Corridor {
    string file_format  
    string file_url  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
CorridorMetadata {
    string title  
    string description  
    string creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o CorridorMetadata : "metadata"
Container ||--|o CorridorData : "data"
CorridorData ||--}o Corridor : "corridor"
Corridor ||--}o Named : "type_of"
CorridorMetadata ||--}o Named : "created_by"
CorridorMetadata ||--|o Named : "see_also"
CorridorMetadata ||--|o Named : "derived_from"

```


## dataset

```mermaid
erDiagram
Container {
    string iri  
    string metadata  
}
AssayDatasetData {
    string donor  
    string sample  
    string spatial_entity  
    string cell_summary  
    string collision  
    string corridor  
}
AssayDataset {
    string pref_label  
    string description  
    string external_link  
    string technology  
    string thumbnail  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
SampleID {
    uriorcurie id  
}
CellSummaryID {
    uriorcurie id  
}

Container ||--|o AssayDatasetData : "data"
AssayDatasetData ||--}o AssayDataset : "dataset"
AssayDataset ||--}o CellSummaryID : "cell_summaries"
AssayDataset ||--|o SampleID : "links_back_to"
AssayDataset ||--}o Named : "type_of"

```


## donor

```mermaid
erDiagram
Container {
    string iri  
    string metadata  
}
DonorData {
    string sample  
    string dataset  
    string spatial_entity  
    string cell_summary  
    string collision  
    string corridor  
}
Donor {
    string pref_label  
    string description  
    string external_link  
    double age  
    float bmi  
    string sex  
    string sex_id  
    string race  
    string race_id  
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
SampleID {
    uriorcurie id  
}

Container ||--|o DonorData : "data"
DonorData ||--}o Donor : "donor"
Donor ||--}o SampleID : "provides_samples"
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
Corridor {
    string file_format  
    string file_url  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
CollisionSummary {
    string collision_method  
    uriorcurie id  
    string label  
}
CollisionItem {
    float volume  
    float percentage  
    uriorcurie id  
    string label  
}
SpatialEntityID {
    uriorcurie id  
}
CellSummary {
    string annotation_method  
    uriorcurieList aggregated_summaries  
    string modality  
    string donor_sex  
    uriorcurie id  
    string label  
}
CellSummaryRow {
    string cell_label  
    integer count  
    float percentage  
    uriorcurie id  
    string label  
}
GeneExpression {
    string gene_label  
    string ensembl_id  
    float mean_gene_expression_value  
    uriorcurie id  
    string label  
}
GeneID {
    uriorcurie id  
}
CellID {
    uriorcurie id  
}
SpatialEntity {
    string pref_label  
    string creator_name  
    date create_date  
    float x_dimension  
    float y_dimension  
    float z_dimension  
    string dimension_unit  
    integer slice_count  
    integer slice_thickness  
    uriorcurie id  
    string label  
}
SpatialPlacement {
    date placement_date  
    float x_scaling  
    float y_scaling  
    float z_scaling  
    string scaling_unit  
    float x_rotation  
    float y_rotation  
    float z_rotation  
    string rotation_unit  
    string rotation_order  
    float x_translation  
    float y_translation  
    float z_translation  
    string translation_unit  
    uriorcurie id  
    string label  
}
AnatomicalStructureID {
    uriorcurie id  
}
AssayDataset {
    string pref_label  
    string description  
    string external_link  
    string technology  
    string thumbnail  
    uriorcurie id  
    string label  
}
SampleOrDonorID {
    uriorcurie id  
}
CellSummaryID {
    uriorcurie id  
}
TissueBlock {
    string pref_label  
    string description  
    string external_link  
    integer section_count  
    float section_size  
    string section_size_unit  
    uriorcurie id  
    string label  
}
CorridorID {
    uriorcurie id  
}
CollisionSummaryID {
    uriorcurie id  
}
Dataset {
    string title  
    string description  
    string creation_date  
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
Grant {
    string funder  
    string awardNumber  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}
TissueSection {
    string pref_label  
    string description  
    string external_link  
    integer section_number  
    uriorcurie id  
    string label  
}
Donor {
    string pref_label  
    string description  
    string external_link  
    double age  
    float bmi  
    string sex  
    string sex_id  
    string race  
    string race_id  
    string consortium_name  
    string provider_name  
    string provider_uuid  
    uriorcurie id  
    string label  
}
SampleID {
    uriorcurie id  
}
DatasetGraphMetadata {
    string title  
    string description  
    string creation_date  
    string version  
    string license  
    string publisher  
}

Container ||--|o DatasetGraphMetadata : "metadata"
Container ||--|o DatasetGraphData : "data"
DatasetGraphData ||--}o Donor : "donor"
DatasetGraphData ||--}o TissueBlock : "sample"
DatasetGraphData ||--}o AssayDataset : "dataset"
DatasetGraphData ||--}o SpatialEntity : "spatial_entity"
DatasetGraphData ||--}o CellSummary : "cell_summary"
DatasetGraphData ||--}o CollisionSummary : "collision"
DatasetGraphData ||--}o Corridor : "corridor"
Corridor ||--}o Named : "type_of"
CollisionSummary ||--}| CollisionItem : "collision_items"
CollisionSummary ||--}o Named : "type_of"
CollisionItem ||--|| SpatialEntityID : "spatial_entity_reference"
CollisionItem ||--}o Named : "type_of"
CellSummary ||--}| CellSummaryRow : "summary_rows"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--|| CellID : "cell_id"
CellSummaryRow ||--}o GeneExpression : "gene_expressions"
CellSummaryRow ||--}o Named : "type_of"
GeneExpression ||--|| GeneID : "gene_id"
GeneExpression ||--}o Named : "type_of"
SpatialEntity ||--}o AnatomicalStructureID : "collides_with"
SpatialEntity ||--|| SpatialPlacement : "placement"
SpatialEntity ||--}o Named : "type_of"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--}o Named : "type_of"
AssayDataset ||--}o CellSummaryID : "cell_summaries"
AssayDataset ||--|o SampleOrDonorID : "links_back_to"
AssayDataset ||--}o Named : "type_of"
TissueBlock ||--}o Named : "partially_overlaps"
TissueBlock ||--|o SpatialEntityID : "rui_location"
TissueBlock ||--|o SpatialEntityID : "extraction_site"
TissueBlock ||--}o TissueSection : "sections"
TissueBlock ||--}o Dataset : "datasets"
TissueBlock ||--}o CollisionSummaryID : "collision_summaries"
TissueBlock ||--}o CorridorID : "corridors"
TissueBlock ||--|o SampleOrDonorID : "links_back_to"
TissueBlock ||--}o Named : "type_of"
Dataset ||--}o Creator : "creators"
Dataset ||--}o Person : "reviewers"
Dataset ||--|o Named : "see_also"
Dataset ||--}o Grant : "funders"
Dataset ||--|o Named : "doi"
Dataset ||--}o Person : "project_leads"
Dataset ||--}o Person : "externalReviewers"
Dataset ||--}o Distribution : "distributions"
Dataset ||--|o Dataset : "was_derived_from"
Person ||--}o Named : "type_of"
TissueSection ||--}o TissueBlock : "related_samples"
TissueSection ||--}o Dataset : "datasets"
TissueSection ||--|o SampleOrDonorID : "links_back_to"
TissueSection ||--}o Named : "type_of"
Donor ||--}o SampleID : "provides_samples"
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
    string creation_date  
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
    float x_dimension  
    float y_dimension  
    float z_dimension  
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
    float x_scaling  
    float y_scaling  
    float z_scaling  
    string scaling_unit  
    float x_rotation  
    float y_rotation  
    float z_rotation  
    string rotation_unit  
    string rotation_order  
    float x_translation  
    float y_translation  
    float z_translation  
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
    string creation_date  
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
    float concentration  
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
    string creation_date  
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
    float x_dimension  
    float y_dimension  
    float z_dimension  
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
    date placement_date  
    float x_scaling  
    float y_scaling  
    float z_scaling  
    string scaling_unit  
    float x_rotation  
    float y_rotation  
    float z_rotation  
    string rotation_unit  
    string rotation_order  
    float x_translation  
    float y_translation  
    float z_translation  
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
    string creation_date  
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
    string donor  
    string dataset  
    string spatial_entity  
    string cell_summary  
    string collision  
    string corridor  
}
TissueBlock {
    string pref_label  
    string description  
    string external_link  
    integer section_count  
    float section_size  
    string section_size_unit  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
SampleOrDonorID {
    uriorcurie id  
}
CorridorID {
    uriorcurie id  
}
CollisionSummaryID {
    uriorcurie id  
}
Dataset {
    string title  
    string description  
    string creation_date  
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
Grant {
    string funder  
    string awardNumber  
}
Creator {
    string conforms_to  
    uriorcurie id  
    string label  
}
TissueSection {
    string pref_label  
    string description  
    string external_link  
    integer section_number  
    uriorcurie id  
    string label  
}
SpatialEntityID {
    uriorcurie id  
}

Container ||--|o SampleData : "data"
SampleData ||--}o TissueBlock : "sample"
TissueBlock ||--}o Named : "partially_overlaps"
TissueBlock ||--|o SpatialEntityID : "rui_location"
TissueBlock ||--|o SpatialEntityID : "extraction_site"
TissueBlock ||--}o TissueSection : "sections"
TissueBlock ||--}o Dataset : "datasets"
TissueBlock ||--}o CollisionSummaryID : "collision_summaries"
TissueBlock ||--}o CorridorID : "corridors"
TissueBlock ||--|o SampleOrDonorID : "links_back_to"
TissueBlock ||--}o Named : "type_of"
Dataset ||--}o Creator : "creators"
Dataset ||--}o Person : "reviewers"
Dataset ||--|o Named : "see_also"
Dataset ||--}o Grant : "funders"
Dataset ||--|o Named : "doi"
Dataset ||--}o Person : "project_leads"
Dataset ||--}o Person : "externalReviewers"
Dataset ||--}o Distribution : "distributions"
Dataset ||--|o Dataset : "was_derived_from"
Person ||--}o Named : "type_of"
TissueSection ||--}o TissueBlock : "related_samples"
TissueSection ||--}o Dataset : "datasets"
TissueSection ||--|o SampleOrDonorID : "links_back_to"
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
    string donor  
    string sample  
    string dataset  
    string cell_summary  
    string collision  
    string corridor  
}
SpatialEntity {
    string pref_label  
    string creator_name  
    date create_date  
    float x_dimension  
    float y_dimension  
    float z_dimension  
    string dimension_unit  
    integer slice_count  
    integer slice_thickness  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
SpatialPlacement {
    date placement_date  
    float x_scaling  
    float y_scaling  
    float z_scaling  
    string scaling_unit  
    float x_rotation  
    float y_rotation  
    float z_rotation  
    string rotation_unit  
    string rotation_order  
    float x_translation  
    float y_translation  
    float z_translation  
    string translation_unit  
    uriorcurie id  
    string label  
}
AnatomicalStructureID {
    uriorcurie id  
}

Container ||--|o SpatialData : "data"
SpatialData ||--}o SpatialEntity : "spatial_entity"
SpatialEntity ||--}o AnatomicalStructureID : "collides_with"
SpatialEntity ||--|| SpatialPlacement : "placement"
SpatialEntity ||--}o Named : "type_of"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--}o Named : "type_of"

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
    string creation_date  
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
    string creation_date  
    string publisher  
    stringList references  
    string license  
    uriorcurie id  
    string label  
}
Dataset {
    string title  
    string description  
    string creation_date  
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
Container ||--|o Dataset : "was_derived_from"
Dataset ||--}o Creator : "creators"
Dataset ||--}o Person : "reviewers"
Dataset ||--|o Named : "see_also"
Dataset ||--}o Grant : "funders"
Dataset ||--|o Named : "doi"
Dataset ||--}o Person : "project_leads"
Dataset ||--}o Person : "externalReviewers"
Dataset ||--}o Distribution : "distributions"
Dataset ||--|o Dataset : "was_derived_from"
Person ||--}o Named : "type_of"

```


