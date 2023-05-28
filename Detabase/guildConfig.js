const { Schema, model } = require("mongoose");

const guildConfig = new Schema({
    id: String,
    logs: {
        type: Boolean,
        default: false
    },
    logschannel: {
        type: String,
    },
    chatbotchannel: {
        type: String,
    },
    wordlist: {
        type: String,
    },
    channellog: {
        type: Boolean,
        default: false
    },
    antilink: {
        type: Boolean,
        default: false
    },
    antiword: {
        type: Boolean,
        default: false
    },
    words: {
        type: Array,
    },
    messagelog: {
        type: Boolean,
        default: false
    },
    memberlog: {
        type: Boolean,
        default: false
    },
    ignoreXP:[String],
    ignorelink:[String],
    xp: {
        type:Boolean,
        default: true
    },
    xpTimeout: {
        type:Number,
        default:60000
    },
    xpLevelUP: {
        message: {
            type: String,
            default: "🎉Congrats {mention} 🎉 on reaching {level} level!"
        },
        channel: {
            type: String,
            default: 'message.author.channel'
        },
        enable: {
            type: Boolean,
            default: true
        }
    },
    xpRate: {
        type: Number,
        default: 1
    },
    xpLimit: {
        up: {
            type: Number,
            default: 20
        },
        down: {
            type: Number,
            default: 5
        },
    },
    bgrank: {
        type: String,
        default: '  https://fuca.fluiddev.xyz/assets/img/bg.jpeg'
    },
    verify: {
        type: Boolean,
        default: false
    },
    verifychannel: {
        type: String
    },
    verifyrole: {
        type: String
    },
    verifytime: {
        type: String
    },
    verifyaction: {
        type: String
    },
    verifytype: {
        type: String,
        default: 'discord'
    },
    
})

module.exports = model("Guild_Cosmic", guildConfig)
