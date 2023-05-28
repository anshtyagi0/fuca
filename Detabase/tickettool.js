const mongoose = require("mongoose");

/**
 * Roles structure
 * - roleId: string;
 */

const ticket = mongoose.Schema({
    guildId: String,
    roles: String,
    category: String,
    name:  String,
    transcriptchannel: String,
    total: {
        type: Number,
        default: 0
    },
    opens: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model("ticket", ticket);