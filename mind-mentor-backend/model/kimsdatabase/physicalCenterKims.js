const mongoose = require("mongoose");

const CenterSchema = new mongoose.Schema(
  {
    Access_Email_Id_s: { type: String },
    Active_Centre: { type: Boolean },
    Added_Time: { type: Date },
    Added_User: { type: String },

    Address: {
      address_line_1: String,
      address_line_2: String,
      district_city: String,
      state_province: String,
      postal_Code: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },

    Centre_Name: { type: String },
    Cost_of_Online_class: { type: Number },
    Cost_of_Physical_Class: { type: Number },
    Different_Pricing_when_enrolled_centre: { type: String },

    ID: { type: String}, // ✅ Excel ID
    Invoice_prefix: { type: String },

    Modified_Time: { type: Date },
    Modified_User: { type: String },

    Payment_Collection_by_FMM: { type: String },
    Physical_Centre: { type: String },
    Record_Status: { type: String },
    Service_Centre: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CenterDataKIMS", CenterSchema);
