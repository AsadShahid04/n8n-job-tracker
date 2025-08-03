#!/usr/bin/env node

/**
 * Comprehensive test runner for n8n job parsing scripts
 * Run with: node scripts/run-all-tests.js
 */

const {
  createMockInput,
  runTest,
  validateJobObject,
  sampleSimplifyJobsData,
  sampleSpeedyApplyData,
  sampleAirtableData,
} = require("./test-setup");

// Import the actual scripts
const parseSimplifyJobs = require("./parse-simplifyjobs");
const parseSpeedyApply = require("./parse-speedyapply");
const filterJobs = require("./filter-jobs");

/**
 * Test SimplifyJobs parsing
 */
function testSimplifyJobsParsing() {
  console.log("\n🔍 Testing SimplifyJobs parsing...");
  
  const mockInput = createMockInput([sampleSimplifyJobsData]);
  global.$input = mockInput;
  
  const result = parseSimplifyJobs();
  
  if (!Array.isArray(result)) {
    throw new Error("Result should be an array");
  }
  
  if (result.length === 0) {
    throw new Error("Should parse at least one job");
  }
  
  // Validate first job
  const firstJob = result[0].json;
  validateJobObject(firstJob);
  
  if (firstJob.source !== "SimplifyJobs") {
    throw new Error("Job source should be 'SimplifyJobs'");
  }
  
  console.log(`✅ SimplifyJobs parsing: ${result.length} jobs parsed successfully`);
  console.log(`   Sample job: ${firstJob.title} at ${firstJob.company}`);
  
  return result;
}

/**
 * Test SpeedyApply parsing
 */
function testSpeedyApplyParsing() {
  console.log("\n🔍 Testing SpeedyApply parsing...");
  
  const mockInput = createMockInput([sampleSpeedyApplyData]);
  global.$input = mockInput;
  
  const result = parseSpeedyApply();
  
  if (!Array.isArray(result)) {
    throw new Error("Result should be an array");
  }
  
  if (result.length === 0) {
    throw new Error("Should parse at least one job");
  }
  
  // Validate first job
  const firstJob = result[0].json;
  validateJobObject(firstJob);
  
  if (firstJob.source !== "SpeedyApply") {
    throw new Error("Job source should be 'SpeedyApply'");
  }
  
  console.log(`✅ SpeedyApply parsing: ${result.length} jobs parsed successfully`);
  console.log(`   Sample job: ${firstJob.title} at ${firstJob.company}`);
  
  return result;
}

/**
 * Test job filtering with multiple sources
 */
function testJobFiltering() {
  console.log("\n🔍 Testing job filtering and combination...");
  
  const mockInput = createMockInput([
    sampleSimplifyJobsData,
    sampleSpeedyApplyData,
    sampleAirtableData,
    sampleAirtableData, // Second Airtable source
  ]);
  
  global.$input = mockInput;
  
  const result = filterJobs();
  
  if (!Array.isArray(result)) {
    throw new Error("Result should be an array");
  }
  
  // Validate all jobs
  result.forEach((jobWrapper, index) => {
    try {
      validateJobObject(jobWrapper.json);
    } catch (error) {
      throw new Error(`Job ${index + 1} validation failed: ${error.message}`);
    }
  });
  
  console.log(`✅ Job filtering: ${result.length} jobs filtered and combined`);
  
  // Show sample jobs
  result.slice(0, 3).forEach((job, index) => {
    console.log(`   Job ${index + 1}: ${job.json.title} at ${job.json.company} (${job.json.source})`);
  });
  
  return result;
}

/**
 * Test edge cases
 */
function testEdgeCases() {
  console.log("\n🔍 Testing edge cases...");
  
  // Test empty data
  const emptyInput = createMockInput([""]);
  global.$input = emptyInput;
  
  const emptyResult = parseSimplifyJobs();
  if (emptyResult.length !== 0) {
    throw new Error("Should handle empty data correctly");
  }
  console.log("✅ Empty data handling: OK");
  
  // Test invalid data
  const invalidInput = createMockInput(["This is not markdown data"]);
  global.$input = invalidInput;
  
  const invalidResult = parseSimplifyJobs();
  if (!Array.isArray(invalidResult)) {
    throw new Error("Should return array for invalid data");
  }
  console.log("✅ Invalid data handling: OK");
  
  // Test malformed markdown
  const malformedData = `# Test Jobs

| Company | Role | Location |
|---------|------|----------|
| Google | Software Engineer | Bay Area |
| Microsoft | AI/ML | Seattle |
`;
  
  const malformedInput = createMockInput([malformedData]);
  global.$input = malformedInput;
  
  const malformedResult = parseSimplifyJobs();
  if (!Array.isArray(malformedResult)) {
    throw new Error("Should handle malformed markdown");
  }
  console.log("✅ Malformed markdown handling: OK");
  
  return true;
}

/**
 * Test real-world scenarios
 */
function testRealWorldScenarios() {
  console.log("\n🔍 Testing real-world scenarios...");
  
  const realWorldData = `# Summer 2024 Internships

| Company | Role | Location | Application |
|---------|------|----------|-------------|
| [Software Engineer Intern](https://careers.google.com/jobs/results/123) | Google | Mountain View, CA | [Apply](https://careers.google.com/jobs/results/123) |
| [Machine Learning Intern](https://careers.microsoft.com/jobs/456) | Microsoft | Redmond, WA | [Apply](https://careers.microsoft.com/jobs/456) |
| [Data Science Intern](https://careers.meta.com/jobs/789) | Meta | Menlo Park, CA | [Apply](https://careers.meta.com/jobs/789) |
| [Full Stack Engineer](https://careers.apple.com/jobs/101) | Apple | Cupertino, CA | [Apply](https://careers.apple.com/jobs/101) |
| [AI Research Intern](https://careers.openai.com/jobs/202) | OpenAI | San Francisco, CA | [Apply](https://careers.openai.com/jobs/202) |
`;
  
  const mockInput = createMockInput([realWorldData]);
  global.$input = mockInput;
  
  const result = parseSimplifyJobs();
  
  if (!Array.isArray(result)) {
    throw new Error("Result should be an array");
  }
  
  if (result.length === 0) {
    throw new Error("Should parse real-world data");
  }
  
  // Validate all jobs
  result.forEach((jobWrapper, index) => {
    try {
      validateJobObject(jobWrapper.json);
    } catch (error) {
      throw new Error(`Real-world job ${index + 1} validation failed: ${error.message}`);
    }
  });
  
  console.log(`✅ Real-world scenario: ${result.length} jobs parsed successfully`);
  
  return result;
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log("🚀 Starting comprehensive tests for n8n job parsing scripts...\n");
  
  const tests = [
    { name: "SimplifyJobs Parsing", fn: testSimplifyJobsParsing },
    { name: "SpeedyApply Parsing", fn: testSpeedyApplyParsing },
    { name: "Job Filtering", fn: testJobFiltering },
    { name: "Edge Cases", fn: testEdgeCases },
    { name: "Real-world Scenarios", fn: testRealWorldScenarios },
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  tests.forEach((test, index) => {
    console.log(`\n📋 Test ${index + 1}/${totalTests}: ${test.name}`);
    const result = runTest(test.name, test.fn);
    
    if (result.success) {
      passedTests++;
    }
  });
  
  console.log(`\n📊 Final Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All tests passed! Your JavaScript parsing logic is working correctly.");
    console.log("✅ You can now safely use these scripts in your n8n workflow.");
  } else {
    console.log("⚠️  Some tests failed. Please review the errors above before deploying.");
  }
  
  return passedTests === totalTests;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testSimplifyJobsParsing,
  testSpeedyApplyParsing,
  testJobFiltering,
  testEdgeCases,
  testRealWorldScenarios,
  runAllTests,
}; 