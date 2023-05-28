const { Schema, model } = require("mongoose");

const giveaway = new Schema({
    channelID: String,
    guildID: String,
    messageID: String,
    title: String,
    winners: String,
    winner: String,
    pause: {
        type: Boolean,
        default: false
    },
    users: {
        type: String,
        default: '0'
    },
    userlist: Array,
    endat: String,
    host: String,
    active: Boolean
})

module.exports = model("giveaway", giveaway)