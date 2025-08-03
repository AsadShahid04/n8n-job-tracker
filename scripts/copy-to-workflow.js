#!/usr/bin/env node

/**
 * Utility script to copy external JavaScript files into n8n workflow format
 * This script reads the external .js files and outputs them in a format
 * that can be easily copied into n8n workflow JSON
 */

const fs = require("fs");
const path = require("path");

// List of script files to process
const scriptFiles = [
  "parse-simplifyjobs.js",
  "parse-speedyapply.js",
  "filter-jobs.js",
];

/**
 * Escape a string for JSON inclusion
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeForJson(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Process a script file and output it in n8n format
 * @param {string} filename - The script filename
 */
function processScript(filename) {
  const filePath = path.join(__dirname, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filename}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const escapedContent = escapeForJson(content);

  console.log(`\n📄 ${filename}:`);
  console.log("=".repeat(50));
  console.log("Copy this content into your n8n workflow jsCode parameter:");
  console.log("=".repeat(50));
  console.log(escapedContent);
  console.log("=".repeat(50));
}

/**
 * Generate a complete workflow snippet with all scripts
 */
function generateWorkflowSnippet() {
  console.log("\n🔧 Complete Workflow Snippet:");
  console.log("=".repeat(50));
  console.log("Copy this into your workflow JSON jsCode parameters:");
  console.log("=".repeat(50));

  scriptFiles.forEach((filename) => {
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const escapedContent = escapeForJson(content);

      console.log(`\n// ${filename}:`);
      console.log(`"jsCode": "${escapedContent}"`);
    }
  });

  console.log("=".repeat(50));
}

/**
 * Main function
 */
function main() {
  console.log("🚀 N8N Script Copy Utility");
  console.log(
    "This utility helps you copy external scripts into n8n workflow format\n"
  );

  // Process each script individually
  scriptFiles.forEach(processScript);

  // Generate complete workflow snippet
  generateWorkflowSnippet();

  console.log(
    "\n✅ Done! You can now copy these scripts into your n8n workflow."
  );
  console.log("\n💡 Tips:");
  console.log(
    "1. Copy the escaped content into the jsCode parameter of your Code nodes"
  );
  console.log("2. Make sure to update the workflow JSON file");
  console.log("3. Test the workflow to ensure everything works correctly");
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  processScript,
  generateWorkflowSnippet,
  escapeForJson,
};
