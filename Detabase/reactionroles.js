const mongoose = require("mongoose");

/**
 * Roles structure
 * - roleId: string;
 * - roleDescription: string;
 * - roleEmoji: string;
 */

const productSchema = mongoose.Schema({
    guildId: String,
    roles: Array,
});

module.exports = mongoose.model("reactionrole", productSchema);