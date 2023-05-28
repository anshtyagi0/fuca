const { Schema, model } = require("mongoose");

const welcome  = new Schema({
    id: String,
    message: {
        type: String,
        default: '{mention} Welcome to {guild}!'
    },
    enable: {
        type: Boolean,
        default: false
    },
    channel: String,
    bgimage: {
        type: String,
        default: '  https://fuca.fluiddev.xyz/assets/img/bg.jpeg'
    },
    roleid: String
})

module.exports = model("Welcome", welcome);