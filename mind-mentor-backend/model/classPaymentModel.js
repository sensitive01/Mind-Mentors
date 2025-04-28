const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const classPaymentSchema = new Schema(
  {
    amount: { type: Number },
    classDetails: {
      packageId:{type:String},
      centerId:{type:String},
      centerName: { type: String },
      selectedClass: { type: String },
      selectedPackage: { type: String },
      classType: { type: String },
      day: { type: String },
      numberOfClasses: { type: Number },
      offlineClasses: { type: Number },
      onlineClasses: { type: Number },
      classMode:{type:String},

    },
    enqId: { type: String },
    kidId: { type: String },
    kidName: { type: String },
    kitItem: { type: String, default: "" },
    kitItems: { type: [String], default: [] }, 
    selectionType: { type: String },
    baseAmount: { type: Number },
    gstAmount: { type: Number },
    totalAmount: { type: Number },
    whatsappNumber: { type: String },
    parentId: { type: String },
    raz_transaction_id: { type: String },
    timestamp: { type: Date, default: Date.now },
    centerId: { type: String }, 
    centerName: { type: String }, 
    customAmount: { type: Number, default: 0 }, 
    discount: { type: Number }, 
    discountAmount: { type: Number, default: 0 }, 
    programs: [
      {
        program: { type: String },
        level: { type: String },
      },
    ], 
    paymentStatus:{type:String,default:"Pending"},
    paymentMode:{type:String,default:"online"}
  },
  { timestamps: true }
);

// Create a model from the schema
const classPaymentModel = mongoose.model("ClassPayment", classPaymentSchema);

module.exports = classPaymentModel;
