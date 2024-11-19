# HRA DO Processor Diagrams
## 2d-ftu

```mermaid
erDiagram
Container {
    uriorcurie iri  
}
FtuIllustration {
    uriorcurie located_in  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
FtuIllustrationNode {
    string node_name  
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
FtuMetadata {
    string title  
    string description  
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o FtuMetadata : "metadata"
Container ||--}o FtuIllustration : "data"
FtuIllustration ||--}o FtuIllustrationFile : "image_file"
FtuIllustration ||--}o FtuIllustrationNode : "illustration_node"
FtuIllustration ||--}o Named : "type_of"
FtuIllustrationNode ||--}o Named : "type_of"
FtuIllustrationFile ||--}o Named : "type_of"

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
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
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
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o BasicMetadata : "metadata"

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
    uriorcurie cell_id  
    string cell_label  
    integer count  
    float percentage  
    uriorcurie id  
    string label  
}
GeneExpression {
    uriorcurie gene_id  
    string gene_label  
    string ensembl_id  
    float mean_gene_expression_value  
    uriorcurie id  
    string label  
}

Container ||--|o CellSummaryData : "data"
CellSummaryData ||--}o CellSummary : "cell_summary"
CellSummary ||--}| CellSummaryRow : "summary_rows"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--}o GeneExpression : "gene_expressions"
CellSummaryRow ||--}o Named : "type_of"
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
    uriorcurieList created_by  
    string version  
    string creation_date  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
    uriorcurieList had_member  
    uriorcurieList ontology_root  
}

Container ||--|o CollectionMetadata : "metadata"

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
    uriorcurie spatial_entity_reference  
    float volume  
    float percentage  
    uriorcurie id  
    string label  
}
CollisionMetadata {
    string title  
    string description  
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o CollisionMetadata : "metadata"
Container ||--|o CollisionData : "data"
CollisionData ||--}o CollisionSummary : "collision"
CollisionSummary ||--}| CollisionItem : "collision_items"
CollisionSummary ||--}o Named : "type_of"
CollisionItem ||--}o Named : "type_of"

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
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o CorridorMetadata : "metadata"
Container ||--|o CorridorData : "data"
CorridorData ||--}o Corridor : "corridor"
Corridor ||--}o Named : "type_of"

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
    uriorcurieList cell_summaries  
    uriorcurie links_back_to  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}

Container ||--|o AssayDatasetData : "data"
AssayDatasetData ||--}o AssayDataset : "dataset"
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
    integer age  
    float bmi  
    string sex  
    string sex_id  
    string race  
    string race_id  
    string consortium_name  
    string provider_name  
    string provider_uuid  
    uriorcurieList provides_samples  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}

Container ||--|o DonorData : "data"
DonorData ||--}o Donor : "donor"
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
    uriorcurie spatial_entity_reference  
    float volume  
    float percentage  
    uriorcurie id  
    string label  
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
    uriorcurie cell_id  
    string cell_label  
    integer count  
    float percentage  
    uriorcurie id  
    string label  
}
GeneExpression {
    uriorcurie gene_id  
    string gene_label  
    string ensembl_id  
    float mean_gene_expression_value  
    uriorcurie id  
    string label  
}
SpatialEntity {
    string pref_label  
    string creator_name  
    date create_date  
    float x_dimension  
    float y_dimension  
    float z_dimension  
    string dimension_unit  
    uriorcurieList collides_with  
    integer slice_count  
    integer slice_thickness  
    uriorcurie id  
    string label  
}
SpatialPlacement {
    uriorcurie target  
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
AssayDataset {
    string pref_label  
    string description  
    string external_link  
    string technology  
    string thumbnail  
    uriorcurieList cell_summaries  
    uriorcurie links_back_to  
    uriorcurie id  
    string label  
}
TissueBlock {
    string pref_label  
    string description  
    uriorcurie rui_location  
    uriorcurie extraction_site  
    string external_link  
    integer section_count  
    float section_size  
    string section_size_unit  
    uriorcurieList collision_summaries  
    uriorcurieList corridors  
    uriorcurie links_back_to  
    uriorcurie id  
    string label  
}
Dataset {
    string title  
    string description  
    string creation_date  
    string version  
    string license  
    uriorcurie see_also  
    string publisher  
    string citation  
    string citationOverall  
    uriorcurie doi  
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
    uriorcurie links_back_to  
    uriorcurie id  
    string label  
}
Donor {
    string pref_label  
    string description  
    string external_link  
    integer age  
    float bmi  
    string sex  
    string sex_id  
    string race  
    string race_id  
    string consortium_name  
    string provider_name  
    string provider_uuid  
    uriorcurieList provides_samples  
    uriorcurie id  
    string label  
}
DatasetGraphMetadata {
    string title  
    string description  
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
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
CollisionItem ||--}o Named : "type_of"
CellSummary ||--}| CellSummaryRow : "summary_rows"
CellSummary ||--}o Named : "type_of"
CellSummaryRow ||--}o GeneExpression : "gene_expressions"
CellSummaryRow ||--}o Named : "type_of"
GeneExpression ||--}o Named : "type_of"
SpatialEntity ||--|| SpatialPlacement : "placement"
SpatialEntity ||--}o Named : "type_of"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--}o Named : "type_of"
AssayDataset ||--}o Named : "type_of"
TissueBlock ||--}o Named : "partially_overlaps"
TissueBlock ||--}o TissueSection : "sections"
TissueBlock ||--}o Dataset : "datasets"
TissueBlock ||--}o Named : "type_of"
Dataset ||--}o Creator : "creators"
Dataset ||--}o Person : "reviewers"
Dataset ||--}o Grant : "funders"
Dataset ||--}o Person : "project_leads"
Dataset ||--}o Person : "externalReviewers"
Dataset ||--}o Distribution : "distributions"
Dataset ||--|o Dataset : "was_derived_from"
Person ||--}o Named : "type_of"
TissueSection ||--}o TissueBlock : "related_samples"
TissueSection ||--}o Dataset : "datasets"
TissueSection ||--}o Named : "type_of"
Donor ||--}o Named : "type_of"

```


## graph

```mermaid
erDiagram
Container {
    uriorcurie iri  
    stringList data  
}
BasicMetadata {
    string title  
    string description  
    uriorcurieList created_by  
    string version  
    string creation_date  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o BasicMetadata : "metadata"

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
    uriorcurie extraction_set  
    integer rui_rank  
    uriorcurie id  
    string label  
}
Named {
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
ExtractionSet {
    string pref_label  
    uriorcurie extraction_set_for  
    integer rui_rank  
    uriorcurie id  
    string label  
}
LandmarkMetadata {
    string title  
    string description  
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o LandmarkMetadata : "metadata"
Container ||--|o LandmarkData : "data"
LandmarkData ||--}| ExtractionSet : "landmarks"
LandmarkData ||--}| SpatialEntity : "spatial_entities"
SpatialEntity ||--}o Creator : "creators"
SpatialEntity ||--|o SpatialObjectReference : "object_reference"
SpatialEntity ||--}o SpatialPlacement : "placements"
SpatialEntity ||--}o Named : "type_of"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--}o Named : "type_of"
SpatialObjectReference ||--|| SpatialPlacement : "placement"
SpatialObjectReference ||--}o Named : "type_of"
ExtractionSet ||--}o Named : "type_of"

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
    uriorcurie used_by_experiment  
    uriorcurie id  
    string label  
}
RegisteredAntibody {
    string lot_number  
    uriorcurie id  
    string label  
}
ExperimentCycle {
    integer cycle_number  
    uriorcurie id  
    string label  
}
MultiplexedAntibodyBasedImagingExperiment {
    string study_method  
    string tissue_preservation  
    uriorcurieList protocol_doi  
    uriorcurieList author_orcid  
    uriorcurieList has_cycle  
    uriorcurie id  
    string label  
}
AnatomicalStructure {
    uriorcurie id  
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
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o OmapMetadata : "metadata"
Container ||--|o OmapDataset : "data"
OmapDataset ||--}| Antibody : "antibody"
OmapDataset ||--|| MultiplexedAntibodyBasedImagingExperiment : "experiment"
OmapDataset ||--}| ExperimentCycle : "cycles"
OmapDataset ||--|| AntibodyPanel : "antibody_panel"
AntibodyPanel ||--}| ExperimentUsedAntibody : "contains_antibodies"
AntibodyPanel ||--}o Named : "type_of"
ExperimentUsedAntibody ||--|| RegisteredAntibody : "based_on"
ExperimentUsedAntibody ||--}o Named : "type_of"
RegisteredAntibody ||--}o Named : "type_of"
ExperimentCycle ||--}| ExperimentUsedAntibody : "uses_antibodies"
ExperimentCycle ||--}o Named : "type_of"
MultiplexedAntibodyBasedImagingExperiment ||--|| AnatomicalStructure : "sample_organ"
MultiplexedAntibodyBasedImagingExperiment ||--}o Named : "type_of"
Antibody ||--}o DetectStatement : "detects"
Antibody ||--}o BindsToStatement : "binds_to"
BindsToStatement ||--|| Antibody : "antibody_id"
DetectStatement ||--}| Protein : "protein_id"

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
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
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
SpatialPlacement ||--|| SpatialEntity : "target"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--}o Named : "type_of"
SpatialObjectReference ||--|| SpatialPlacement : "placement"
SpatialObjectReference ||--}o Named : "type_of"

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
    uriorcurie rui_location  
    uriorcurie extraction_site  
    string external_link  
    integer section_count  
    float section_size  
    string section_size_unit  
    uriorcurieList collision_summaries  
    uriorcurieList corridors  
    uriorcurie links_back_to  
    uriorcurie id  
    string label  
}
Named {
    uriorcurie id  
    string label  
}
Dataset {
    string title  
    string description  
    string creation_date  
    string version  
    string license  
    uriorcurie see_also  
    string publisher  
    string citation  
    string citationOverall  
    uriorcurie doi  
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
    uriorcurie links_back_to  
    uriorcurie id  
    string label  
}

Container ||--|o SampleData : "data"
SampleData ||--}o TissueBlock : "sample"
TissueBlock ||--}o Named : "partially_overlaps"
TissueBlock ||--}o TissueSection : "sections"
TissueBlock ||--}o Dataset : "datasets"
TissueBlock ||--}o Named : "type_of"
Dataset ||--}o Creator : "creators"
Dataset ||--}o Person : "reviewers"
Dataset ||--}o Grant : "funders"
Dataset ||--}o Person : "project_leads"
Dataset ||--}o Person : "externalReviewers"
Dataset ||--}o Distribution : "distributions"
Dataset ||--|o Dataset : "was_derived_from"
Person ||--}o Named : "type_of"
TissueSection ||--}o TissueBlock : "related_samples"
TissueSection ||--}o Dataset : "datasets"
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
    uriorcurieList collides_with  
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
    uriorcurie target  
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

Container ||--|o SpatialData : "data"
SpatialData ||--}o SpatialEntity : "spatial_entity"
SpatialEntity ||--|| SpatialPlacement : "placement"
SpatialEntity ||--}o Named : "type_of"
SpatialPlacement ||--|o SpatialEntity : "source"
SpatialPlacement ||--}o Named : "type_of"

```


## vocab

```mermaid
erDiagram
Container {
    uriorcurie iri  
    stringList data  
}
BasicMetadata {
    string title  
    string description  
    uriorcurieList created_by  
    string creation_date  
    string version  
    string license  
    string publisher  
    uriorcurie see_also  
    uriorcurie derived_from  
}

Container ||--|o BasicMetadata : "metadata"

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
    string license  
    uriorcurie see_also  
    uriorcurie id  
    string label  
}
Dataset {
    string title  
    string description  
    string creation_date  
    string version  
    string license  
    uriorcurie see_also  
    string publisher  
    string citation  
    string citationOverall  
    uriorcurie doi  
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
Container ||--}| Distribution : "distributions"
Container ||--|o Dataset : "was_derived_from"
Dataset ||--}o Creator : "creators"
Dataset ||--}o Person : "reviewers"
Dataset ||--}o Grant : "funders"
Dataset ||--}o Person : "project_leads"
Dataset ||--}o Person : "externalReviewers"
Dataset ||--}o Distribution : "distributions"
Dataset ||--|o Dataset : "was_derived_from"
Person ||--}o Named : "type_of"

```


