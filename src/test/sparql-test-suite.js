/**
 * SPARQL Query Test Framework
 * 
 * This framework executes SPARQL test cases against an RDF graph and validates
 * the results against expected outputs.
 */

import fs from 'fs';
import sh from 'shelljs';
import { query, materialize } from '../utils/robot.js';

/**
 * Test case definition
 */
export class AskQueryTest {
    constructor(name, description, queryText) {
      this.name = name;
      this.description = description;
      this.queryText = queryText;
    }
  }
  
/**
 * Test suite for running all test cases
 */
export class SPARQLTestSuite {
  constructor(inputGraphPath) {
    this.inputGraphPath = inputGraphPath;
    this.testCases = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.tdbDirectory = '/tmp/.tdb';
  }

  /**
   * Add a test case to the suite
   */
  addTestCase(testCase) {
    this.testCases.push(testCase);
  }

  /**
   * Run all test cases in the suite
   */
  runAllTests() {
    console.log(`Running ${this.testCases.length} SPARQL test cases against graph data: ${this.inputGraphPath}`);

    console.log('Storing the graph to Jena TDB store...');

    // Remove existing TDB directory if it exists
    sh.rm('-rf', this.tdbDirectory);
    materialize(this.inputGraphPath, this.tdbDirectory);

    for (const testCase of this.testCases) {
      this.runTest(testCase);
    }
    
    this.printSummary();
    return this.results;
  }

  /**
   * Run a single test case
   */
  runTest(testCase) {
    console.log(`\nRunning test: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);
    
    // Prepare the output file path for the query result
    const outputPath = `/tmp/${testCase.name.replace(/\s+/g, '_')}.out`;
    this.results.total++;
    
    try {
      // Create a temporary file for the query
      const queryPath = `/tmp/${testCase.name.replace(/\s+/g, '_')}.sparql`;
      fs.writeFileSync(queryPath, testCase.queryText, 'utf8');
      query(this.tdbDirectory, queryPath, outputPath, true);
      
      const result = this.readOutputFile(outputPath);
      
      if (result === "true") {
        console.log('✓ Test passed');
        this.results.passed++;
        this.results.details.push({
          name: testCase.name,
          status: 'passed'
        });
      } else {
        console.log('✗ Test failed');
        this.results.failed++;
        this.results.details.push({
          name: testCase.name,
          status: 'failed'
        });
      }
    } catch (error) {
      console.error('✗ Test error:', error.message);
      this.results.failed++;
      this.results.details.push({
        name: testCase.name,
        status: 'error',
        reason: error.message
      });
    }
  }

  /**
   * Read the output file
   */
  readOutputFile(outputPath) {
    try {
      return fs.readFileSync(outputPath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read output file ${outputPath}: ${error.message}`);
    }
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n==== Test Summary ====');
    console.log(`Total tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success rate: ${((this.results.passed / this.results.total) * 100).toFixed(2)}%`);
  }
}