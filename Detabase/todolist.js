const { Schema, model } = require("mongoose");

const todolist = new Schema({
    userID: String,
    tasks: {
        type: String,
        default: '0'
    },
    list: Array,
})

module.exports = model("todolist", todolist)