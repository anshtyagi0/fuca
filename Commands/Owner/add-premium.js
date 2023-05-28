const premiumScheme = require("../../Detabase/premiumScheme.js");
const day = require('dayjs')
const { EmbedBuilder, Message, Client } = require("discord.js");

module.exports = {
    name: 'add-premium',
    description: 'add premium to a server.',
    category: "Owner",

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message, args) => {
        try {
            if (message.author.id !== '671390595184459782') return;

            if (!args[0]) return message.reply("Please specify a guild id.")
            if (!client.guilds.cache.has(args[0])) return message.reply("Its an invalid guild id.")

            premiumScheme.findOne({ Guild: args[0] }, async (err, data) => {
                if (data) data.delete();
                if (args[1]) {
                    const Expire = day(args[1]).valueOf()
                    new premiumScheme({
                        Guild: args[0],
                        Expire,
                        Permanent: false,
                    }).save();
                } else {
                    new premiumScheme({
                        Guild: args[0],
                        Expire: 0,
                        Permanent: true,
                    }).save();
                }
                message.reply('Saved data!')

            })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN add-premium COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }
}