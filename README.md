# N8N Job Tracker

This project contains an N8N workflow that automatically scrapes LinkedIn job postings, analyzes them against a resume using AI, and saves matching jobs to Google Sheets.

## Setup Instructions

### 1. Prerequisites

- N8N instance running
- OpenAI API key
- Google Service Account credentials
- Google Sheets document

### 2. Credentials Setup

#### OpenAI Credentials

1. Go to your N8N credentials section
2. Create a new OpenAI credential
3. Add your OpenAI API key
4. Note the credential ID for use in the template

#### Google Service Account

1. Create a Google Service Account in Google Cloud Console
2. Download the JSON key file
3. In N8N, create a new Google API credential
4. Upload the service account JSON file
5. Note the credential ID for use in the template

### 3. Google Sheets Setup

1. Create a new Google Sheets document
2. Share it with your service account email (with edit permissions)
3. Note the document ID from the URL (the long string between /d/ and /edit)

### 4. Workflow Setup

#### Using the Template

1. Copy `workflows/linkedin-job.template.json` to `workflows/linkedin-job.json`
2. Replace the following placeholders in the copied file:

**OpenAI Node:**

- `YOUR_OPENAI_CREDENTIAL_ID` → Your actual OpenAI credential ID

**Google Sheets Node:**

- `YOUR_GOOGLE_API_CREDENTIAL_ID` → Your actual Google API credential ID
- `YOUR_GOOGLE_SHEETS_DOCUMENT_ID` → Your Google Sheets document ID
- `YOUR_GOOGLE_SHEETS_URL` → Your Google Sheets URL

**Wait Node:**

- `YOUR_WEBHOOK_ID` → The webhook ID generated when you set up the workflow

**Resume Node:**

- `YOUR_RESUME_TEXT_HERE` → Your actual resume text

**Meta Section:**

- `YOUR_INSTANCE_ID` → Your N8N instance ID

### 5. Customization

#### LinkedIn Job Search URL

Modify the URL in the "Scrape Last 24 hours Job" node to match your job search criteria:

- Change keywords (e.g., "software engineer intern")
- Modify location (geoId parameter)
- Adjust experience level (f_E parameter)

#### Job Match Score Threshold

In the "Score Filter" node, you can adjust the minimum job match score (currently set to 50).

#### Schedule

The workflow runs on a schedule. You can modify the schedule in the "Schedule Trigger" node.

## Workflow Overview

1. **Schedule Trigger**: Starts the workflow on a schedule
2. **Resume**: Sets your resume text for AI analysis
3. **Scrape Last 24 hours Job**: Fetches LinkedIn job listings
4. **Extract Job Links**: Parses job URLs from the search results
5. **Loop Over Items**: Processes each job individually
6. **Wait**: Adds delay between requests to avoid rate limiting
7. **Scrape Each Job**: Fetches individual job details
8. **Parse**: Extracts job title, company, location, and description
9. **OpenAI**: Analyzes job match using AI
10. **Edit Fields**: Formats the AI response
11. **Score Filter**: Filters jobs by match score
12. **Save to Google Sheets**: Saves matching jobs to spreadsheet

## Security Notes

- The original workflow file (`workflows/linkedin-job.json`) is excluded from git via .gitignore
- Only the template file (`workflows/linkedin-job.template.json`) is committed to the repository
- All sensitive data (credentials, personal info) is masked in the template
- Always use the template and replace placeholders with your actual values

## Troubleshooting

### Common Issues

1. **Google Sheets Permission Denied**

   - Ensure the service account email has edit access to the Google Sheets document
   - Check that the document ID is correct

2. **OpenAI API Errors**

   - Verify your OpenAI API key is valid and has sufficient credits
   - Check the credential ID in the workflow

3. **LinkedIn Rate Limiting**

   - The workflow includes a 10-second wait between requests
   - You may need to increase this if you encounter rate limiting

4. **Job Parsing Errors**
   - LinkedIn's HTML structure may change over time
   - Update the CSS selectors in the "Parse" node if needed

## File Structure

```
n8n-job-tracker/
├── workflows/
│   ├── linkedin-job.json          # Original workflow (gitignored)
│   └── linkedin-job.template.json # Template file (committed)
├── credentials/                   # N8N credentials (gitignored)
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```
