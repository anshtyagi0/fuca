const { Schema, model } = require("mongoose");

const premium  = new Schema({
    Guild: String,
    Expire: Number,
    Permanent: Boolean
})

module.exports = model("premium-guild", premium);