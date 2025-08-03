// Parse and filter jobs from multiple sources with comprehensive logging and error handling
function filterJobs() {
  try {
    console.log("🔍 Filter Jobs: Starting job filtering and combination...");
    console.log(
      "📊 Filter Jobs: Number of input sources:",
      $input.all().length
    );

    const jobs = [];

    // Process SimplifyJobs data
    if ($input.all()[0] && $input.all()[0].json) {
      console.log("📊 Filter Jobs: Processing SimplifyJobs data...");
      const simplifyJobsData = $input.all()[0].json;
      console.log(
        "📊 Filter Jobs: SimplifyJobs data type:",
        typeof simplifyJobsData
      );
      console.log(
        "📊 Filter Jobs: SimplifyJobs data length:",
        simplifyJobsData.length
      );

      // Parse SimplifyJobs markdown format
      const lines = simplifyJobsData.split("\n");
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
      console.log("✅ Filter Jobs: Parsed", simplifyJobsCount, "SimplifyJobs");
    } else {
      console.log("⚠️  Filter Jobs: No SimplifyJobs data found");
    }

    // Process SpeedyApply data (using same source for now)
    if ($input.all()[1] && $input.all()[1].json) {
      console.log("📊 Filter Jobs: Processing SpeedyApply data...");
      const speedyApplyData = $input.all()[1].json;
      console.log(
        "📊 Filter Jobs: SpeedyApply data type:",
        typeof speedyApplyData
      );
      console.log(
        "📊 Filter Jobs: SpeedyApply data length:",
        speedyApplyData.length
      );

      const lines = speedyApplyData.split("\n");
      let speedyApplyCount = 0;

      for (const line of lines) {
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
      console.log(
        "✅ Filter Jobs: Parsed",
        speedyApplyCount,
        "SpeedyApply jobs"
      );
    } else {
      console.log("⚠️  Filter Jobs: No SpeedyApply data found");
    }

    // Process Airtable data from both sources (using same source for now)
    if ($input.all()[2]) {
      console.log("📊 Filter Jobs: Processing Airtable 1 data...");
      const airtableJobs1 = $input.all()[2].json || [];
      console.log(
        "📊 Filter Jobs: Airtable 1 jobs count:",
        airtableJobs1.length
      );
      jobs.push(...airtableJobs1);
      console.log(
        "✅ Filter Jobs: Added",
        airtableJobs1.length,
        "Airtable 1 jobs"
      );
    } else {
      console.log("⚠️  Filter Jobs: No Airtable 1 data found");
    }

    if ($input.all()[3]) {
      console.log("📊 Filter Jobs: Processing Airtable 2 data...");
      const airtableJobs2 = $input.all()[3].json || [];
      console.log(
        "📊 Filter Jobs: Airtable 2 jobs count:",
        airtableJobs2.length
      );
      jobs.push(...airtableJobs2);
      console.log(
        "✅ Filter Jobs: Added",
        airtableJobs2.length,
        "Airtable 2 jobs"
      );
    } else {
      console.log("⚠️  Filter Jobs: No Airtable 2 data found");
    }

    console.log("📊 Filter Jobs: Total jobs before filtering:", jobs.length);

    // Filter for undergrad-eligible roles in preferred locations
    const locations = [
      "Bay Area",
      "San Francisco",
      "Dallas",
      "Austin",
      "NYC",
      "New York",
      "NJ",
      "New Jersey",
      "California",
      "Texas",
      "New York",
    ];
    const roles = [
      "SWE",
      "Software Engineer",
      "AI/ML",
      "Data Science",
      "Full-stack",
      "Full Stack",
      "Intern",
      "Internship",
    ];
    const skills = [
      "Python",
      "C++",
      "JavaScript",
      "Kubernetes",
      "Docker",
      "AI",
      "ML",
      "Machine Learning",
    ];

    console.log("🔍 Filter Jobs: Applying filters...");
    console.log("📍 Filter Jobs: Preferred locations:", locations);
    console.log("💼 Filter Jobs: Preferred roles:", roles);
    console.log("🛠️  Filter Jobs: Preferred skills:", skills);

    const filteredJobs = jobs.filter((job) => {
      const locationMatch =
        job.location &&
        locations.some((loc) =>
          job.location.toLowerCase().includes(loc.toLowerCase())
        );

      const roleMatch =
        job.title &&
        roles.some((role) =>
          job.title.toLowerCase().includes(role.toLowerCase())
        );

      const skillsMatch =
        job.description &&
        skills.some((skill) =>
          job.description.toLowerCase().includes(skill.toLowerCase())
        );

      return locationMatch && (roleMatch || skillsMatch);
    });

    console.log("✅ Filter Jobs: Filtered jobs count:", filteredJobs.length);

    // Remove duplicates based on title and company
    const uniqueJobs = [];
    const seen = new Set();

    for (const job of filteredJobs) {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
    }

    console.log("✅ Filter Jobs: Final unique jobs count:", uniqueJobs.length);
    if (uniqueJobs.length > 0) {
      console.log("📝 Filter Jobs: Sample filtered job:", uniqueJobs[0]);
    }

    return uniqueJobs.map((job) => ({ json: job }));
  } catch (error) {
    console.log("❌ Filter Jobs: Error occurred:", error.message);
    console.log("❌ Filter Jobs: Error stack:", error.stack);

    // Return empty array to prevent workflow from crashing
    return [];
  }
}

// Execute the function for n8n
const result = filterJobs();

// Export for testing
module.exports = filterJobs;
