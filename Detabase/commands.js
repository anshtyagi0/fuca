const { Schema, model } = require("mongoose");

const afk = new Schema({
    client: String,
    number: {
        type: String,
    },
})

module.exports = model("commands", afk)