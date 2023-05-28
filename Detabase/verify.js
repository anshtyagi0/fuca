const { Schema, model } = require("mongoose");

const verify = new Schema({
    user: String,
    guild: String,
    verified: {
        type: Boolean,
        default: false
    },
    time: {
        type: String,
    },
    correct: String,
})

module.exports = model("verify", verify)