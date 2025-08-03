// Utility function to load external scripts for n8n
// This function can be used to load script files dynamically

const fs = require("fs");
const path = require("path");

/**
 * Load a script file and return its content
 * @param {string} scriptPath - Path to the script file
 * @returns {string} - The script content
 */
function loadScript(scriptPath) {
  try {
    const fullPath = path.join(__dirname, scriptPath);
    return fs.readFileSync(fullPath, "utf8");
  } catch (error) {
    console.error(`Error loading script ${scriptPath}:`, error.message);
    return "";
  }
}

/**
 * Get the content of a specific script by name
 * @param {string} scriptName - Name of the script (without .js extension)
 * @returns {string} - The script content
 */
function getScriptContent(scriptName) {
  const scriptPath = `${scriptName}.js`;
  return loadScript(scriptPath);
}

// Export functions for use in n8n
module.exports = {
  loadScript,
  getScriptContent,
};
