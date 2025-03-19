import axios from "axios";

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_MSGKART_API_KEY;
const ACCOUNT_ID = import.meta.env.VITE_MSGKART_ACCOUNT_ID;
const CALLER_ID = import.meta.env.VITE_MSGKART_CALLER_ID;
const CHESSKID_GROUP_ID = import.meta.env.VITE_CHESSKID_GROUP_ID;

/**
 * Function to make a call
 * @param {string} from - Caller phone number
 * @param {string} to - Recipient phone number
 * @returns {Promise<object>} - API response
 */
export async function makeCall(from, to) {
  const url = `${API_BASE_URL}/v1/Accounts/${ACCOUNT_ID}/Calls/connect?apikey=${API_KEY}`;
  const params = new URLSearchParams({
    From:"919894386276",
    To: "917559889322",
    CallerId: CALLER_ID,
  });

  try {
    const response = await axios.post(url, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  } catch (error) {
    console.error("Error making call:", error.message);
    throw error;
  }
}

/**
 * Function to send a single message
 * @param {string} recipient - Recipient phone number
 * @param {object} messageData - Message template data
 * @returns {Promise<object>} - API response
 */
export async function sendMessage(recipient, messageData) {
  console.log("Sending message",recipient,messageData,)
  console.log(`${API_BASE_URL}/api/v1/message/${ACCOUNT_ID}/template?apikey=${API_KEY}`)
  const url = `${API_BASE_URL}/api/v1/message/${ACCOUNT_ID}/template?apikey=${API_KEY}`;

  try {
    const response = await axios.post(
      url,
      { ...messageData, to: recipient },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

/**
 * Function to send bulk messages
 * @param {array} subscribers - List of subscriber phone numbers
 * @param {object} messageData - Message template data
 * @returns {Promise<object>} - API response
 */
export async function sendBulkMessage(subscribers, messageData) {
  const url = `${API_BASE_URL}/api/v2/message/${ACCOUNT_ID}/template?apikey=${API_KEY}`;

  try {
    const response = await axios.post(
      url,
      { ...messageData, subscribers },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending bulk message:", error.message);
    throw error;
  }
}

/**
 * Fetch and update ChessKid ratings
 * @param {number} iterations - Number of pages to fetch
 * @param {function} saveRating - Function to save rating data
 * @returns {Promise<void>}
 */
export async function updateChessKidRatings(iterations, saveRating) {
  let url = `https://www.chesskid.com/groups/rss/${CHESSKID_GROUP_ID}/3MHqxsgC/7?page=80`;

  for (let i = 0; i < iterations; i++) {
    if (!url) break;

    try {
      const response = await axios.get(url);
      const kids = response.data?.kids?.kid || [];
      
      kids.forEach((kid) => {
        const data = {
          username: kid.username,
          fastChessRating: kid.blitzRating,
          puzzleRating: kid.puzzleRating,
          gamesPlayed:
            parseInt(kid.alltime.blitzStats.wins) +
            parseInt(kid.alltime.blitzStats.draws) +
            parseInt(kid.alltime.blitzStats.losses),
        };
        saveRating(data);
      });

      url = response.data?.kids?.next || null;
    } catch (error) {
      console.error("Error updating ChessKid ratings:", error.message);
      break;
    }
  }
}
