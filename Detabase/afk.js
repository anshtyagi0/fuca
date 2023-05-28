const { Schema, model } = require("mongoose");

const afk = new Schema({
    userID: {
        type: String,
        required:true
    },
    reason: {
        type: String,
        required:true
    },
    timestamp: {
        type: Number,
        required:true
    },
})

module.exports = model("afk", afk)