# N8N Workflow Scripts

This directory contains external JavaScript files for the n8n workflow to improve code readability and maintainability.

## Script Files

### `parse-simplifyjobs.js`

- **Purpose**: Parses SimplifyJobs markdown data and extracts job information
- **Input**: Raw markdown data from SimplifyJobs repository
- **Output**: Array of job objects with title, company, location, link, and source
- **Features**: Comprehensive logging, error handling, and data validation

### `parse-speedyapply.js`

- **Purpose**: Parses SpeedyApply markdown data and extracts job information
- **Input**: Raw markdown data from SpeedyApply repository
- **Output**: Array of job objects with title, company, location, link, and source
- **Features**: Comprehensive logging, error handling, and data validation

### `filter-jobs.js`

- **Purpose**: Combines and filters jobs from multiple sources
- **Input**: Multiple job data sources (SimplifyJobs, SpeedyApply, Airtable)
- **Output**: Filtered and deduplicated job list
- **Features**:
  - Location-based filtering (Bay Area, NYC, Texas, etc.)
  - Role-based filtering (SWE, AI/ML, Data Science, etc.)
  - Skills-based filtering (Python, C++, JavaScript, etc.)
  - Duplicate removal
  - Comprehensive logging

### `load-script.js`

- **Purpose**: Utility functions to load external script files
- **Usage**: Helper functions for dynamic script loading in n8n

## How to Use

### Option 1: Direct File Reference

In your n8n workflow, you can reference these files directly by copying their content into the `jsCode` parameter of Code nodes.

### Option 2: Dynamic Loading

Use the `load-script.js` utility to dynamically load scripts:

```javascript
// In your n8n Code node
const { getScriptContent } = require("./scripts/load-script.js");

// Load and execute a specific script
const scriptContent = getScriptContent("parse-simplifyjobs");
eval(scriptContent);
```

### Option 3: Import in Workflow

You can also import these scripts directly in your workflow JSON by referencing the file paths.

## Benefits

1. **Maintainability**: Code is separated from workflow configuration
2. **Reusability**: Scripts can be reused across different workflows
3. **Version Control**: Better tracking of code changes
4. **Testing**: Individual scripts can be tested independently
5. **Collaboration**: Easier for team members to understand and modify code

## File Structure

```
scripts/
├── README.md
├── load-script.js
├── parse-simplifyjobs.js
├── parse-speedyapply.js
└── filter-jobs.js
```

## Notes

- All scripts include comprehensive error handling and logging
- Scripts are designed to work with n8n's `$input` and `$json` context
- Each script returns data in the format expected by n8n nodes
- Logging uses emojis for better visual identification in n8n logs
