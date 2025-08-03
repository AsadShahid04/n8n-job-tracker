/**
 * Test setup for n8n job parsing scripts
 * This file provides mock data and testing utilities
 */

const fs = require("fs");
const path = require("path");

// Mock n8n context for testing
const mockN8nContext = {
  $input: {
    first: () => ({ json: "" }),
    all: () => [],
  },
  $json: {},
};

/**
 * Create a mock n8n input context
 * @param {Array} data - Array of input data objects
 * @returns {Object} Mock n8n input context
 */
function createMockInput(data) {
  return {
    first: () => ({ json: data[0] || "" }),
    all: () => data.map((item) => ({ json: item })),
  };
}

/**
 * Mock console.log for testing
 */
const originalConsoleLog = console.log;
const testLogs = [];

function mockConsoleLog(...args) {
  testLogs.push(args.join(" "));
  originalConsoleLog(...args);
}

function resetConsoleLog() {
  console.log = originalConsoleLog;
  testLogs.length = 0;
}

function getTestLogs() {
  return [...testLogs];
}

/**
 * Sample markdown data for testing
 */
const sampleSimplifyJobsData = `# Summer 2024 Internships

| Company | Role | Location | Application |
|---------|------|----------|-------------|
| [Software Engineer Intern](https://example.com/job1) | Google | Bay Area, CA | [Apply](https://example.com/apply1) |
| [AI/ML Intern](https://example.com/job2) | Microsoft | Seattle, WA | [Apply](https://example.com/apply2) |
| [Data Science Intern](https://example.com/job3) | Meta | NYC | [Apply](https://example.com/apply3) |
| [Full Stack Intern](https://example.com/job4) | Apple | Austin, TX | [Apply](https://example.com/apply4) |
| [Software Engineer](https://example.com/job5) | Amazon | Bay Area, CA | [Apply](https://example.com/apply5) |
`;

const sampleSpeedyApplyData = `# SpeedyApply Internships

| Company | Role | Location | Application |
|---------|------|----------|-------------|
| [SWE Intern](https://speedyapply.com/job1) | Netflix | Los Angeles, CA | [Apply](https://speedyapply.com/apply1) |
| [Machine Learning Intern](https://speedyapply.com/job2) | Tesla | Palo Alto, CA | [Apply](https://speedyapply.com/apply2) |
| [Backend Engineer](https://speedyapply.com/job3) | Uber | San Francisco, CA | [Apply](https://speedyapply.com/apply3) |
| [Frontend Developer](https://speedyapply.com/job4) | Airbnb | San Francisco, CA | [Apply](https://speedyapply.com/apply4) |
`;

const sampleAirtableData = [
  {
    title: "Software Engineer Intern",
    company: "Stripe",
    location: "San Francisco, CA",
    link: "https://stripe.com/careers",
    source: "Airtable",
  },
  {
    title: "AI Research Intern",
    company: "OpenAI",
    location: "San Francisco, CA",
    link: "https://openai.com/careers",
    source: "Airtable",
  },
];

/**
 * Test utility functions
 */
function runTest(testName, testFunction) {
  console.log = mockConsoleLog;
  testLogs.length = 0;

  try {
    console.log(`🧪 Running test: ${testName}`);
    const result = testFunction();
    console.log = originalConsoleLog;
    console.log(`✅ Test passed: ${testName}`);
    return { success: true, result, logs: getTestLogs() };
  } catch (error) {
    console.log = originalConsoleLog;
    console.log(`❌ Test failed: ${testName}`);
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message, logs: getTestLogs() };
  }
}

/**
 * Validate job object structure
 */
function validateJobObject(job) {
  const requiredFields = ["title", "company", "location", "link", "source"];
  const missingFields = requiredFields.filter((field) => !job[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  if (typeof job.title !== "string" || job.title.length === 0) {
    throw new Error("Job title must be a non-empty string");
  }

  if (typeof job.company !== "string" || job.company.length === 0) {
    throw new Error("Company must be a non-empty string");
  }

  return true;
}

/**
 * Test data generators
 */
function generateTestData() {
  return {
    simplifyJobs: sampleSimplifyJobsData,
    speedyApply: sampleSpeedyApplyData,
    airtable: sampleAirtableData,
  };
}

module.exports = {
  createMockInput,
  mockConsoleLog,
  resetConsoleLog,
  getTestLogs,
  runTest,
  validateJobObject,
  generateTestData,
  sampleSimplifyJobsData,
  sampleSpeedyApplyData,
  sampleAirtableData,
};
