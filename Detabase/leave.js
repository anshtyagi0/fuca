const { Schema, model } = require("mongoose");

const leave  = new Schema({
    id: String,
    message: {
        type: String,
        default: '{mention} Left the server {guild}!'
    },
    enable: {
        type: Boolean,
        default: false
    },
    channel: String,
    bgimage: {
        type: String,
        default: '  https://fuca.fluiddev.xyz/assets/img/bg.jpeg'
    }
})

module.exports = model("Leave", leave);