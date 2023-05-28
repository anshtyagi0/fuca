const { Schema, model } = require("mongoose");

const term = new Schema({
    user: String,
    first: {
        type: Boolean,
        default: true
    },
    banned: {
        type: Boolean,
        default: false
    }
})

module.exports = model("term", term)