const { Schema, model } = require("mongoose");

const user_xp = new Schema({
    user: String,
    guild: String,
    xp: {
        type:Number,
        default:0
    },
    level: {
        type:Number,
        default:0
    },
    lasXP: {
        type:Number,
        default: 0
    },
})

module.exports = model("User_xp", user_xp)