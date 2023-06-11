const Discord = require('discord.js');
const webhook = require("webhook-discord")
const fetch = require("node-fetch");
const Hook = new webhook.Webhook("URL")


module.exports = async (client) => {
    try {
        client.user.setPresence({
            status: "online",
            activities: [
                {
                    name: `/help | ${client.guilds.cache.size}`,
                    type: Discord.ActivityType.Playing,

                },
            ]

        })
        console.log(`[API] Logged in as ${client.user.tag}.`);
    } catch (err) {
        return console.log(err)
    }
}
