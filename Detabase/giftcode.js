const { Schema, model } = require("mongoose");

const giftcode  = new Schema({
    Expire: Number,
    code: String,
})

module.exports = model("giftcode", giftcode);