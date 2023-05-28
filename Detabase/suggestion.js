const mongoose = require("mongoose");

/**
 * options structure
 * - name: string;
 * - total: number;
 */

const suggestion = mongoose.Schema({
    guildId: String,
    messageId: String,
    channelId: String,
    options1: Array,
    options1list: Array,
    options2: Array,
    options2list: Array,
    options3: Array,
    options3list: Array,
    options4: Array,
    options4list: Array,
    options5: Array,
    options5list: Array,
    title: String,
    total: { type: Number, default: 0 },
    active: Boolean,
    option: Number,
});

module.exports = mongoose.model("suggestion", suggestion);