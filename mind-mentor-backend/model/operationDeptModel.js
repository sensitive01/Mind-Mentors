//enquiry----->Prospects----->Conversion--->Renewals--->

const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  program: { type: String },
  level: { type: String },
  status: { type: String, default: "Pending" }, // enquiry,Active kid, deactive kid 
  enrolledDate:{type:Date}
  // total class
  //attnded
  //remianing

});

const operationDeptSchema = new mongoose.Schema(
  {
    parentFirstName: { type: String },
    parentLastName: { type: String },
    contactNumber: { type: String },
    whatsappNumber: { type: String },
    isSameAsContact: { type: Boolean },
    email: { type: String },
    relationship: { type: String },
    // otherRelationship: { type: String },

    source: { type: String },
    message: { type: String },  //First Note in enq
    // notes: { type: String },
    

    kidFirstName: { type: String },
    kidLastName: { type: String },
    kidId: { type: String },
    kidsGender: { type: String },
    kidsAge: { type: Number },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    programs: {
      type: [ProgramSchema],
    },



    schoolName: { type: String },
    address: { type: String },
    schoolPincode: { type: String },
    intentionOfParents: { type: String },

    enquiryType: { type: String, enum: ["warm", "cold"], default: "cold" },
    
    enquiryStatus: {
      type: String,
      enum: ["Pending", "Qualified Lead", "Unqualified Lead"],
      default: "Pending",
    }, //unAttended, demo intrst ,demo assigned ,demo taken, payment link sent,enrolled,need clarification, call later, not intersted,not answering, wrong nmber,prospectus sent

    disposition: {
      type: String,
      enum: ["RnR", "Call Back", "None","Connected"],
      default: "None",
    },

    enquiryField: { type: String, default: "enquiryList" },
    scheduleDemo: {
      status: {
        type: String,
        enum: ["Pending", "Scheduled", "Conducted", "Cancelled","Attended"],
        default: "Pending",
      },
      sheduledDay: { type: String },
    },
    
    referral:[ {
      referredTo: { type: String },
      referredEmail: { type: String },
    }],
    logs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
    },
    isNewUser :{type:Boolean,default:true},
    paymentData:{type:String},


    // paymentLink: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Requested"],
      default: "Pending",
    },
    // paymentRenewal:{type:String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("OperationDept", operationDeptSchema);
