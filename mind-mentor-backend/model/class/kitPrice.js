const mongoose = require('mongoose');

const kitPriceSchema = new mongoose.Schema({
    quantity:{
        type:Number,

    },
    kitPrice:{
        type:Number
    }


}, { timestamps: true });

module.exports = mongoose.model('kitPrice', kitPriceSchema);
