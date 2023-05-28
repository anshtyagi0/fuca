const mongoose = require("mongoose");

const transcript = mongoose.Schema({
    content: String,
    link: String
});

module.exports = mongoose.model("transcript", transcript);