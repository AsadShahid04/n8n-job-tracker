# n8n Internship Job Tracker

An automated job tracking system built with n8n that fetches internship opportunities from multiple sources, filters them based on your preferences, scores them using AI, and sends daily email digests.

## 🚀 Quick Start

### 1. Local Setup with Docker Compose

```bash
# Clone or navigate to this directory
cd n8n-job-tracker

# Create the data directory
mkdir -p ~/n8n-data

# Replace resume.pdf with your actual resume
cp /path/to/your/resume.pdf ./resume.pdf

# Start n8n
docker-compose up -d

# Check logs
docker logs -f n8n-job-tracker
```

### 2. Access n8n

- **URL**: http://localhost:5678
- **Username**: admin
- **Password**: your_secure_password_here (change this in docker-compose.yml)

## 📋 Prerequisites

### Required Files

- `resume.pdf` - Your resume for AI matching
- API credentials for:
  - OpenAI API
  - Google Sheets API
  - Gmail API

### Environment Setup

1. **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Google Sheets**: Create a Google Sheet and share it with your service account
3. **Gmail**: Enable Gmail API and create OAuth2 credentials

## 🔧 Configuration

### 1. Update Docker Compose Environment Variables

Edit `docker-compose.yml` and change:

```yaml
- N8N_BASIC_AUTH_PASSWORD=your_secure_password_here
- N8N_ENCRYPTION_KEY=your_encryption_key_here_change_this
```

### 2. Set Up API Credentials in n8n

1. Access n8n at http://localhost:5678
2. Go to **Settings** → **Credentials**
3. Add the following credentials:

#### OpenAI API

- **Name**: OpenAI API
- **API Key**: Your OpenAI API key

#### Google Sheets

- **Name**: Google Sheets
- **Service Account Email**: Your service account email
- **Private Key**: Your service account private key

#### Gmail

- **Name**: Gmail
- **Client ID**: Your Gmail OAuth2 client ID
- **Client Secret**: Your Gmail OAuth2 client secret

### 3. Import Workflow

1. In n8n, go to **Workflows**
2. Click **Import from file**
3. Select the `workflow.json` file from this directory
4. Update the following in the workflow:
   - Google Sheet ID in the "Save to Google Sheets" node
   - Your email address in the "Send Daily Email" node

## 🔄 Workflow Configuration

### Data Sources

The workflow fetches jobs from:

- **SimplifyJobs**: GitHub repo with Summer 2024 internships
- **SpeedyApply**: SWE job listings
- **Airtable 1**: Public job board (CSV export)
- **Airtable 2**: Public job board (CSV export)

### Airtable CSV Export Method

The workflow uses Airtable's built-in CSV export feature by appending `&exportFormat=csv` to the public view URLs. This is much more reliable than HTML scraping and provides clean, structured data.

**How it works:**

1. HTTP requests fetch CSV data from public Airtable views
2. Code nodes parse the CSV and extract job information
3. Column mapping is done automatically based on header names
4. Data is cleaned and standardized before filtering

### Filtering Criteria

- **Locations**: Bay Area, Dallas, Austin, NYC, NJ, California, Texas, New York
- **Roles**: SWE, AI/ML, Data Science, Full-stack, Intern, Internship
- **Skills**: Python, C++, JavaScript, Kubernetes, Docker, AI, ML, Machine Learning

### AI Scoring

- Uses OpenAI to analyze job descriptions against your resume
- Provides match score (1-10)
- Generates technical skills summary

## 📅 Scheduling

### Daily Automation

The workflow is configured to run daily at 9:00 AM. To modify:

1. Edit the "Daily Trigger" node in n8n
2. Change the cron expression to your preferred time
3. Example: `0 9 * * *` = 9:00 AM daily

### Manual Testing

1. In n8n, click the "Daily Trigger" node
2. Click "Execute Node" to test the workflow
3. Check the execution logs for any errors

## 🧪 Testing the Airtable Integration

### Quick Test Scripts

We've included test scripts to help you verify the Airtable integration:

#### 1. Bash Test Script

```bash
# Test if URLs are accessible and return CSV data
./test-airtable-urls.sh
```

#### 2. Python Test Script

```bash
# Install Python dependencies
pip install -r requirements.txt

# Test CSV parsing logic
./test-csv-parsing.py
```

### Manual Testing

You can also test the Airtable CSV export URLs directly in your browser:

1. **Airtable 1**:

   ```
   https://airtable.com/app17F0kkWQZhC6HB/shrOTtndhc6HSgnYb/tblp8wxvfYam5sD04?viewControls=on&exportFormat=csv
   ```

2. **Airtable 2**:
   ```
   https://airtable.com/appjSXAWiVF4d1HoZ/shrf04yGbrK3IebAl/tbl7UBhvwqng6GRGZ?viewControls=on&exportFormat=csv
   ```

### Debug CSV Parsing

If the CSV parsing isn't working correctly:

1. **Check the CSV structure**: Visit the URLs above to see the actual column headers
2. **Update column mapping**: Modify the parsing code in the "Parse Airtable" nodes
3. **Test individual nodes**: Execute the "Fetch Airtable Jobs" nodes separately to see the raw CSV data

### Common CSV Issues

- **Column names**: The parser looks for headers containing 'title', 'company', 'location', etc.
- **Quoted fields**: The parser handles CSV with commas in quoted fields
- **Empty rows**: Empty rows are automatically skipped
- **Encoding**: Ensure the CSV is UTF-8 encoded

## 🖥️ 24/7 Local Operation

### Keep Mac Awake

```bash
# Option 1: Using pmset (Terminal)
sudo pmset -c sleep 0
sudo pmset -c disablesleep 1

# Option 2: Using Amphetamine app
# Download from Mac App Store and set to "Indefinitely"

# Option 3: Using caffeinate
caffeinate -i
```

### Monitor Container

```bash
# Check if n8n is running
docker ps

# View logs
docker logs -f n8n-job-tracker

# Restart if needed
docker-compose restart

# Stop the service
docker-compose down
```

## 🚀 Production Deployment

### 1. Build Custom Docker Image

Create a `Dockerfile`:

```dockerfile
FROM n8nio/n8n:latest

# Copy workflow and resume
COPY workflow.json /home/node/.n8n/
COPY resume.pdf /home/node/.n8n/

# Set environment variables
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=your_production_password
ENV N8N_ENCRYPTION_KEY=your_production_encryption_key
```

### 2. Deploy to VPS (Hostinger)

```bash
# Build the image
docker build -t n8n-job-tracker .

# Run on VPS
docker run -d \
  --name n8n-job-tracker \
  --restart always \
  -p 5678:5678 \
  -v n8n-data:/home/node/.n8n \
  n8n-job-tracker
```

### 3. VPS Setup Commands

```bash
# Install Docker on VPS
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Create data volume
docker volume create n8n-data

# Upload your files to VPS
scp docker-compose.yml user@your-vps:/home/user/
scp workflow.json user@your-vps:/home/user/
scp resume.pdf user@your-vps:/home/user/

# On VPS, start the service
cd /home/user
docker-compose up -d
```

## 📊 Expected Output

### Google Sheet Columns

- Job Title
- Company
- Location
- Application Link
- Match Score (1-10)
- Skills Summary
- Source (Airtable 1, Airtable 2, SimplifyJobs, SpeedyApply)
- Date Added

### Daily Email Format

```
Subject: Daily Internship Matches - [Date]

Found X new job matches today:

[Job Title] at [Company]
Location: [Location]
Match Score: 8/10
Skills Match: Strong Python, ML experience
Source: Airtable 1
Apply Here: [Link]

Best regards,
Your Job Tracker
```

## 🔍 Troubleshooting

### Common Issues

1. **Container won't start**

   ```bash
   docker logs n8n-job-tracker
   # Check for port conflicts or permission issues
   ```

2. **Workflow not executing**

   - Check if workflow is activated in n8n
   - Verify cron trigger settings
   - Check execution logs in n8n UI

3. **API errors**

   - Verify credentials are correctly set in n8n
   - Check API quotas and limits
   - Test individual nodes manually

4. **Email not sending**

   - Verify Gmail OAuth2 setup
   - Check email address in workflow
   - Test Gmail node manually

5. **Airtable CSV parsing issues**
   - Check if the Airtable URLs are accessible
   - Verify the CSV structure matches expected format
   - Test the CSV export URLs in browser
   - Check the parsing code in the Code nodes

### Airtable-Specific Issues

1. **CSV not downloading**

   - Ensure the Airtable view is public
   - Check if the URL is correct
   - Try accessing the URL directly in browser

2. **Wrong column mapping**

   - Check the actual CSV headers
   - Update the column indices in the parsing code
   - Test with a sample row

3. **Empty data**
   - Verify the Airtable has data
   - Check if the view filters are too restrictive
   - Test the export URL manually

### Logs and Monitoring

```bash
# View n8n logs
docker logs -f n8n-job-tracker

# Check container status
docker ps

# View resource usage
docker stats n8n-job-tracker
```

## 🔐 Security Notes

- Change default passwords in production
- Use strong encryption keys
- Keep API keys secure
- Consider using secrets management for production
- Enable HTTPS for production deployments

## 📈 Next Steps

1. **Enhance AI Scoring**: Add more sophisticated matching algorithms
2. **Add More Sources**: Integrate LinkedIn, Indeed, or other job boards
3. **Advanced Filtering**: Add more granular location and role filters
4. **Analytics**: Add job application tracking and success metrics
5. **Mobile App**: Create a mobile interface for job tracking

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use case!

---

**Happy Job Hunting! 🎯**
