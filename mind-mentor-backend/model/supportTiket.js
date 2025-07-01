const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    message: {
      type: String,
    },
    time: {
      type: String,
    },

  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
    },
    description: {
      type: String,
    },
    kidId: {
      type: String,
    },
    kidName: {
      type: String,
    },
    parentId: {
      type: String,
    },
    ticketId: {
      type: String,
    },

    status: {
      type: String,

      default: "open",
    },
    priority: {
      type: String,

      default: "medium",
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const supportTiket = mongoose.model("supportTicket", ticketSchema);
module.exports = supportTiket;
