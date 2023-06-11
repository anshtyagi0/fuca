const premiumScheme = require("../../Detabase/premiumScheme.js");

const { EmbedBuilder, Message, Client } = require("discord.js");

module.exports = {
    name: 'remove-premium',
    description: 'delete premium to a server.',
    category: "Owner",

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message, args) => {
        try {
            if (message.author.id !== '671390595184459782') return;

            if (!args[0]) return message.reply("Please specify guild.")

            premiumScheme.findOne({
                Guild: args[0]
            }, async (err, data) => {
                if (!data) return message.reply("Guild is not premium.");
                data.delete();
                return message.reply("Deleted data!")
            })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN REMOVE-PREMIUM COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }
}