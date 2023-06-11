const { EmbedBuilder, Message, ButtonBuilder, ActionRowBuilder, Client, MessageFlags } = require("discord.js");

module.exports = {
    name: 'changename',
    aliases: ['cname'],
    description: "Change this bots name.",
    category: "Owner",
    /**
     * @param {Client} client
     * @param {Message} message
     */


    run: async (client, message, args) => {
        try {
            await message.reply("**RUNNING CHANGE NAME COMMAND...**")
            if (message.author.id === '671390595184459782') {
                image = args.slice(0).join(' ')
                try {
                    client.user.setUsername(image);
                    await message.reply("Successfully changed bot name.")
                } catch (err) {
                    await message.reply("I think many users have this username try something else.")
                }
            } else {
                return await message.reply("You are not my owner.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN CHANGENAME COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }
}