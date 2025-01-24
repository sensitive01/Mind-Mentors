require("dotenv").config(); 
const axios = require("axios");


const API_BASE_URL = process.env.API_BASE_URL; 
const API_KEY = process.env.MSGKART_API_KEY; 
const ACCOUNT_ID = process.env.MSGKART_ACCOUNT_ID; 

const sendMessage = async (recipient, messageData) => {
  console.log("Sending message", recipient, messageData);

  const url = `${API_BASE_URL}/api/v1/message/${ACCOUNT_ID}/template?apikey=${API_KEY}`;

  try {
    const response = await axios.post(
      url,
      { ...messageData, to: recipient },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendMessage;
