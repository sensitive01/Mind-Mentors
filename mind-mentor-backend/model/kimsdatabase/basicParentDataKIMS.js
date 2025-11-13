const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    Added_Time: { type: Date },       // parsed to Date
    Added_User: { type: String },
    Added_by: { type: String },

    Alternate_Email: { type: String },
    Alternate_WhatsApp_Number: { type: String },

    Auto_Number: { type: String },    // keep as string to avoid number issues
    Communicaton_Opt_Out: { type: Boolean },
    Google_Review_Submitted: { type: Boolean },

    ID: { type: String, index: true },  // 🔑 store as String (big integer problem solved)
    Log: { type: String },

    Modified_Time: { type: Date },    // parsed to Date
    Modified_User: { type: String },

    Name: {
      prefix: { type: String },
      first_name: { type: String },
      last_name: { type: String },
      suffix: { type: String },
    },

    Parents_Email: { type: String },
    Record_Status: { type: String },
    WhatsApp_number: { type: String }, // keep as string (phone numbers can start with 0, be > 15 digits, etc.)
  },
  { strict: true } // enforce schema
);

module.exports = mongoose.model("ParentDataKims", parentSchema);
