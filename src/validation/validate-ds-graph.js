import { resolve } from 'path';
import { SPARQLTestSuite, AskQueryTest }  from './sparql-test-suite.js';

export function validateDatasetGraph(context) {
  const { selectedDigitalObject: obj } = context;
  const inputGraphPath = resolve(obj.path, 'enriched/enriched.ttl');

  // Create a new test suite with the input graph
  const testSuite = new SPARQLTestSuite(inputGraphPath);

  // Add test cases to the suite
  testCases.forEach(testCase => testSuite.addTestCase(testCase));

  // Run all tests and print the results
  return testSuite.runAllTests();
}

// Create test cases from the SPARQL queries
const testCases = [
  // Check if tissue block exists and has proper properties
  new AskQueryTest (
    'Check Tissue Block',
    'Check if tissue block exists and has proper properties',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
     PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
     ASK {
       ?tissueBlock a ccf:TissueBlock ;
         rdfs:label ?label ;
         skos:prefLabel ?prefLabel ;
         ccf:has_registration_location ?spatialEntity ;
         ccf:subdivided_into_sections ?tissueSection ;
         ccf:url ?url .
        
       ?spatialEntity a ccf:SpatialEntity ;
         ccf:has_placement ?placement .
         
       ?placement a ccf:SpatialPlacement ;
         ccf:translation_unit ?translationUnit ;
         ccf:rotation_unit ?rotationUnit ;
         ccf:scaling_unit ?scalingUnit .
     }`
  ),

  // Check if donor information exists and connects to samples
  new AskQueryTest (
    'Check Donor',
    'Check if donor information exists and connects to samples',
    `PREFIX ccf: <http://purl.org/ccf/>
      ASK {
        ?donor a ccf:Donor ;
          ccf:age ?age ;
          ccf:bmi ?bmi ;
          ccf:race ?race ;
          ccf:sex ?sex ;
          ccf:samples ?sample .
          
          ?sample a ccf:TissueBlock .
      }`
  ),

  // Check if spatial entity exists and has proper properties
  new AskQueryTest (
    'Check Spatial Entity',
    'Check if spatial entity exists and has proper properties',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
     PREFIX dct: <http://purl.org/dc/terms/>
      ASK {
        ?spatialEntity a ccf:SpatialEntity ;
          rdfs:label ?label ;
          dct:creator ?creator ;
          dct:created ?created ;
          ccf:x_dimension ?xDim ;
          ccf:y_dimension ?yDim ;
          ccf:z_dimension ?zDim ;
          ccf:dimension_unit ?dimUnit ;
          ccf:collides_with ?organType ;
          ccf:has_cell_summary ?cellSummary ;
          ccf:has_collision_summary ?collisionSummary ;
          ccf:has_corridor ?corridor ;
          ccf:has_placement ?placement .
      }`
  ),

  // Check if spatial placement exists and has proper properties
  new AskQueryTest (
    'Check Spatial Placement',
    'Check if spatial placement exists and has proper properties',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      ASK {
        ?placement a ccf:SpatialPlacement ;
          rdfs:label ?label ;
          ccf:placement_date ?placementDate ;
          ccf:placement_for ?spatialEntity ;
          ccf:placement_relative_to ?referenceEntity ;
          ccf:x_translation ?xTrans ;
          ccf:y_translation ?yTrans ;
          ccf:z_translation ?zTrans ;
          ccf:translation_unit ?translationUnit ;
          ccf:x_rotation ?xRot ;
          ccf:y_rotation ?yRot ;
          ccf:z_rotation ?zRot ;
          ccf:rotation_order ?rotationOrder ;
          ccf:rotation_unit ?rotationUnit ;
          ccf:x_scaling ?xScale ;
          ccf:y_scaling ?yScale ;
          ccf:z_scaling ?zScale ;
          ccf:scaling_unit ?scalingUnit .
      }`
  ),

  // Check if dataset exists and has proper properties
  new AskQueryTest (
    'Check Dataset',
    'Check if dataset exists and has proper properties',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
     PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
     ASK {
       ?dataset a ccf:Dataset ;
         rdfs:label ?label ;
         skos:prefLabel ?prefLabel ;
         ccf:url ?url ;
         ccf:thumbnail ?thumbnail ;
         ccf:cell_count ?cellCount ;
         ccf:gene_count ?geneCount ;
         ccf:technology ?technology ;
         ccf:organ_id ?organId ;
         ccf:has_cell_summary ?cellSummary .
     }`
  ),
  
  // Check if cell summary exists and connects to rows
  new AskQueryTest (
    'Check Cell Summary',
    'Check if cell summary exists and connects to rows',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
     ASK {
       ?cellSummary a ccf:CellSummary ;
         rdfs:label ?label ;
         ccf:modality ?modality ;
         ccf:sex ?sex ;
         ccf:cell_annotation_method ?method ;
         ccf:has_cell_summary_row ?cellSummaryRow .
        
       ?cellSummaryRow a ccf:CellSummaryRow ;
         rdfs:label ?rowLabel ;
         ccf:cell_label ?cellLabel ;
         ccf:cell_id ?cellId ;
         ccf:cell_count ?count ;
         ccf:has_gene_expression ?geneExpression ;
         ccf:percentage_of_total ?percentage .
     }`
  ),

  // Check if gene expression data exists
  new AskQueryTest (
    'Check Gene Expression Data',
    'Check if gene expression data exists',
    `PREFIX ccf: <http://purl.org/ccf/>
      ASK {
        ?cellSummaryRow ccf:has_gene_expression ?geneExpression .
      
        ?geneExpression a ccf:GeneExpression ;
          ccf:ensembl_id ?ensemblId ;
          ccf:gene_id ?geneId ;
          ccf:gene_label ?geneLabel ;
          ccf:mean_gene_expression ?expressionLevel .
      }`
  ),

  // Check spatial collision detection data
  new AskQueryTest (
    'Check Spatial Collision Data',
    'Check spatial collision detection data',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
     ASK {
       ?spatialEntity ccf:collides_with ?organType ;
         ccf:has_collision_summary ?collisionSummary .
        
       ?collisionSummary a ccf:CollisionSummary ;
         rdfs:label ?summaryLabel ;
         ccf:collision_method ?method ;
         ccf:has_collision_item ?collisionItem .
        
       ?collisionItem a ccf:CollisionItem ;
         rdfs:label ?itemLabel ;
         ccf:organ_id ?organId ;
         ccf:organ_label ?organLabel ;
         ccf:percentage_of_total ?percentage ;
         ccf:organ_volume ?volume ;
         ccf:has_reference_organ ?referenceOrgan ;
         ccf:has_spatial_entity ?collidedSpatialEntity .
     }`
  ),

  // Check tissue section and dataset relationship
  new AskQueryTest (
    'Check Tissue Section',
    'Check tissue section and dataset relationship',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
     PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
     ASK {
       ?tissueSection a ccf:TissueSection ;
         rdfs:label ?label ;
         skos:prefLabel ?prefLabel ;
         ccf:url ?url ;
         ccf:generates_dataset ?dataset .
        
       ?dataset a ccf:Dataset .
     }`
  ),

  // Check 3D spatial positioning properties
  new AskQueryTest (
    'Check 3D Spatial Positioning',
    'Check 3D spatial positioning properties',
    `PREFIX ccf: <http://purl.org/ccf/>
      ASK {
        ?spatialEntity ccf:x_dimension ?xDim ;
          ccf:y_dimension ?yDim ;
          ccf:z_dimension ?zDim ;
          ccf:dimension_unit ?dimUnit ;
          ccf:has_placement ?placement .
        
        ?placement ccf:x_translation ?xTrans ;
          ccf:y_translation ?yTrans ;
          ccf:z_translation ?zTrans ;
          ccf:translation_unit ?translationUnit ;
          ccf:x_rotation ?xRot ;
          ccf:y_rotation ?yRot ;
          ccf:z_rotation ?zRot ;
          ccf:rotation_order ?rotationOrder ;
          ccf:rotation_unit ?rotationUnit ;
          ccf:x_scaling ?xScale ;
          ccf:y_scaling ?yScale ;
          ccf:z_scaling ?zScale ;
          ccf:scaling_unit ?scalingUnit .
      }`
  ),

  // Check spatial entity corridor data
  new AskQueryTest (
    'Check Corridor Data',
    'Check spatial entity corridor data',
    `PREFIX ccf: <http://purl.org/ccf/>
     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
     ASK {
       ?spatialEntity ccf:has_corridor ?corridor .
      
       ?corridor a ccf:Corridor ;
         rdfs:label ?label ;
         ccf:file_format ?format ;
         ccf:file_url ?url .
     }`
  ),
];