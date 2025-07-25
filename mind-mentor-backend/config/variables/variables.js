require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
  CALLING_API: process.env.CALLING_API,
  MESSAGING_API: process.env.MESSAGING_API,
  MSGKART_PHONENUMBER_ID: process.env.MSGKART_PHONENUMBER_ID,
  MSGKART_TEMPLATE_NAME:process.env.MSGKART_TEMPLATE_NAME
};
