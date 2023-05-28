const { Schema, model } = require("mongoose");

const user_xp = new Schema({
    user: {
        type: String,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    dailyCheck: Number
})

module.exports = model("economy", user_xp)