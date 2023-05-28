const mongoose = require("mongoose");

const ticket = mongoose.Schema({
    guildId: String,
    user: String,
    channel: String,
    channelname:  String,
    open: Boolean,
});

module.exports = mongoose.model("ticketuser", ticket);