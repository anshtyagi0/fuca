const { Schema, model } = require("mongoose");

const user_xp = new Schema({
    user: {
        type: String,
        unique: true
    },
    guild: {
        type: String
    },
    report: {
        type: String
    },
    cmd: {
        type: String
    },
    id: {
        type: String
    }
})

module.exports = model("report", user_xp)