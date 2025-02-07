const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Class Payment schema
const classPaymentSchema = new Schema(
  {
    amount: { type: Number},
    classDetails: {
      selectedCenter: { type: String},
      selectedClass: { type: String},
      selectedPackage: { type: String},
      classType: { type: String},
      day: { type: String},
      numberOfClasses: { type: Number},
      offlineClasses: { type: Number},
      onlineClasses: { type: Number},
    },
    enqId: { type: String},
    kidId: { type: String},
    kidName: { type: String},
    kitItem: { type: String, default: '' },
    selectionType: { type: String},
    baseAmount: { type: Number},
    gstAmount: { type: Number},
    totalAmount: { type: Number},
    whatsappNumber: { type: String},
    parentId: { type: String},
    raz_transaction_id: { type: String},
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create a model from the schema
const classPaymentModel = mongoose.model('ClassPayment', classPaymentSchema);

module.exports = classPaymentModel;
