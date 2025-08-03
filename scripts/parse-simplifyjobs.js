// Parse SimplifyJobs markdown data with logging
function parseSimplifyJobs() {
  try {
    console.log("🔍 Parse SimplifyJobs: Starting markdown parsing...");

    // Handle different input formats
    let markdownData;
    if ($input.first().json && typeof $input.first().json === "string") {
      markdownData = $input.first().json;
    } else if ($input.first().json && $input.first().json.data) {
      markdownData = $input.first().json.data;
    } else {
      console.log("❌ Parse SimplifyJobs: No valid data found");
      return [];
    }

    console.log("📊 Parse SimplifyJobs: Raw data length:", markdownData.length);
    console.log(
      "📊 Parse SimplifyJobs: First 200 chars:",
      markdownData.substring(0, 200)
    );

    const jobs = [];

    // Split into lines and parse markdown table format
    const lines = markdownData.split("\n");
    console.log("📊 Parse SimplifyJobs: Number of lines:", lines.length);

    let simplifyJobsCount = 0;

    for (const line of lines) {
      // Look for markdown table format with job links
      if (line.includes("|") && line.includes("[") && line.includes("]")) {
        const parts = line.split("|").map((part) => part.trim());
        if (parts.length >= 4) {
          // Extract job title from markdown link format [Title](link)
          const titleMatch = parts[1].match(/\[(.*?)\]/);
          const linkMatch = parts[1].match(/\((.*?)\)/);

          const job = {
            title: titleMatch ? titleMatch[1] : parts[1],
            company: parts[2] || "",
            location: parts[3] || "",
            link: linkMatch ? linkMatch[1] : parts[4] || "",
            source: "SimplifyJobs",
          };

          // Filter out header rows and empty entries
          if (
            job.title &&
            job.company &&
            job.title !== "Company" &&
            !job.title.includes("---")
          ) {
            jobs.push(job);
            simplifyJobsCount++;
          }
        }
      }
    }

    console.log("✅ Parse SimplifyJobs: Parsed", simplifyJobsCount, "jobs");
    if (jobs.length > 0) {
      console.log("📝 Parse SimplifyJobs: Sample job:", jobs[0]);
    }

    return jobs.map((job) => ({ json: job }));
  } catch (error) {
    console.log("❌ Parse SimplifyJobs: Error occurred:", error.message);
    console.log("❌ Parse SimplifyJobs: Error stack:", error.stack);
    return [];
  }
}

// Execute the function for n8n
const result = parseSimplifyJobs();

// Export for testing
module.exports = parseSimplifyJobs;
