const cron = require("node-cron");
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

// Schedule: every 2 minutes
cron.schedule("*/1 * * * *", async () => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Fetching ChessKid RSS data...`
  );

  try {
    const url =
      "https://www.chesskid.com/groups/rss/11E7FD5D12F7014280004A78600200C0/3MHqxsgC/7?page=2";

    const { data } = await axios.get(url);

    // Parse XML to JS object
    const result = await parseStringPromise(data);
    const kids = result?.kids?.kid || [];

    console.log("✅ Data fetched successfully");
    console.log(`👦 Total kids found: ${kids.length}`);
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  }
});

console.log("⏳ Cron job scheduled: runs every 2 minutes");
