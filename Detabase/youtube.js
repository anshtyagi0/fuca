const { Schema, model } = require("mongoose");

const youtube = new Schema({
    youtubechannel: {
        type: String,
        required:false
    },
    discordchannel: {
        type: String,
        required:false
    },
    guild: {
        type: String,
        required:false
    },
})

module.exports = model("youtube", youtube)