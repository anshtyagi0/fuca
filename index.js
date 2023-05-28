const { GatewayIntentBits } = require("discord.js");
const Client = require('./structures/client');
const client = new Client({
    shards: "auto",
    allowedMentions: {
        parse: [
            "users",
            "roles",
            "everyone"
        ],
        repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
});

module.exports = client;

require("./structures/Event")(client)
require("./structures/Commands")(client)
require("./structures/slashCommand")(client)
require('./server.js')(client)

client.start(client.config.Bot.ClientToken)