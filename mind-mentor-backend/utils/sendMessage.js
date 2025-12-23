const axios = require("axios");
const { MESSAGING_API, MSGKART_PHONENUMBER_ID, MSGKART_TEMPLATE_NAME } = require("../config/variables/variables");
console.log( MESSAGING_API, MSGKART_PHONENUMBER_ID, MSGKART_TEMPLATE_NAME)

const sendOTP = async (otp, mobile) => {
  console.log("sending otp")
  const data = {
    message: {
      messageType: "template",
      name: MSGKART_TEMPLATE_NAME,
      language: "en",
      components: [
        {
          componentType: "body",
          parameters: [
            {
              type: "text",
              text: otp.toString(),
            },
          ],
        },
        {
          componentType: "button",
          parameters: [
            {
              type: "text",
              text: otp.toString(),
            },
          ],
          index: "0",
          sub_type: "url",
        },
      ],
    },
    to: mobile.replace(/^\+/, ""),
    phoneNumberId:MSGKART_PHONENUMBER_ID,
  };

  try {
    const response = await axios.post(
      MESSAGING_API,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

module.exports = sendOTP;
