// Parse SpeedyApply markdown data with logging
function parseSpeedyApply() {
  try {
    console.log("🔍 Parse SpeedyApply: Starting markdown parsing...");

    // Handle different input formats
    let markdownData;
    if ($input.first().json && typeof $input.first().json === "string") {
      markdownData = $input.first().json;
    } else if ($input.first().json && $input.first().json.data) {
      markdownData = $input.first().json.data;
    } else {
      console.log("❌ Parse SpeedyApply: No valid data found");
      return [];
    }

    console.log("📊 Parse SpeedyApply: Raw data length:", markdownData.length);
    console.log(
      "📊 Parse SpeedyApply: First 200 chars:",
      markdownData.substring(0, 200)
    );

    const jobs = [];

    // Split into lines and parse markdown table format
    const lines = markdownData.split("\n");
    console.log("📊 Parse SpeedyApply: Number of lines:", lines.length);

    let speedyApplyCount = 0;

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
            source: "SpeedyApply",
          };

          // Filter out header rows and empty entries
          if (
            job.title &&
            job.company &&
            job.title !== "Company" &&
            !job.title.includes("---")
          ) {
            jobs.push(job);
            speedyApplyCount++;
          }
        }
      }
    }

    console.log("✅ Parse SpeedyApply: Parsed", speedyApplyCount, "jobs");
    if (jobs.length > 0) {
      console.log("📝 Parse SpeedyApply: Sample job:", jobs[0]);
    }

    return jobs.map((job) => ({ json: job }));
  } catch (error) {
    console.log("❌ Parse SpeedyApply: Error occurred:", error.message);
    console.log("❌ Parse SpeedyApply: Error stack:", error.stack);
    return [];
  }
}

// Execute the function for n8n
const result = parseSpeedyApply();

// Export for testing
module.exports = parseSpeedyApply;
