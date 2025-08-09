const axios = require("axios");
const xml2js = require("xml2js");

// Config
const baseUrl = "https://www.chesskid.com/groups/rss/11E7FD5D12F7014280004A78600200C0/3MHqxsgC/7?page=";
const iterations = 10; // number of pages to process (0 to 41 available)

// Mock function to represent your DB lookup/update
async function getKidFromDB(username) {
  // Replace with your DB query
  return { ID: 123, Auto_Number: 42, Name: username };
}

// Mock function to insert into Chess_Kid_Rating table
async function insertChessKidRating(record) {
  // Replace with your DB insert logic
  console.log("Inserting rating:", record);
}

async function ChesskidRatingUpdate() {
  let url = `${baseUrl}90`; // start page (replace with your starting page number)

  for (let i = 0; i < iterations; i++) {
    if (!url) break;

    try {
      const res = await axios.get(url);
      const xmlData = res.data;

      // Parse XML
      const parsed = await xml2js.parseStringPromise(xmlData, { explicitArray: false });

      // Get kids list
      const kids = parsed?.kids?.kid || [];
      const kidsArray = Array.isArray(kids) ? kids : [kids];

      for (const kid of kidsArray) {
        const username = kid.username;
        const fastChessRating = kid.blitzRating;
        const puzzleRating = kid.puzzleRating;

        const wins = Number(kid.alltime?.blitzStats?.wins || 0);
        const draws = Number(kid.alltime?.blitzStats?.draws || 0);
        const losses = Number(kid.alltime?.blitzStats?.losses || 0);
        const gamesPlayed = wins + draws + losses;

        // Fetch kid from DB
        const fet = await getKidFromDB(username);
        if (fet?.ID != null) {
          // Update DB record
          await insertChessKidRating({
            Added_User: "system", // replace with actual user
            Puzzle_Rating: puzzleRating,
            Updated_on: new Date(),
            Kid_roll_no: fet.Auto_Number,
            Play_rating: fastChessRating,
            Name: fet.Name,
            Games_Played: gamesPlayed,
          });
        }
      }

      // Get next page URL
      url = parsed?.kids?.next || null;
    } catch (err) {
      console.error("Error fetching or processing:", err.message);
      break;
    }
  }
}

// Run
ChesskidRatingUpdate();
