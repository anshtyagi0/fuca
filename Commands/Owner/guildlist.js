const { EmbedBuilder, Message, ButtonBuilder, ActionRowBuilder, Client, MessageFlags } = require("discord.js");

module.exports = {
    name: 'guildlist',
    aliases: ['glist'],
    description: "Change this bots avatar.",
    category: "Owner",
    /**
     * @param {Client} client
     * @param {Message} message
     */


    run: async (client, message, args) => {
        try {
            await message.reply("**RUNNING GUILD LIST COMMAND...**")
            if (message.author.id === '671390595184459782') {
                client.guilds.cache.forEach(guild => {
                    message.channel.send(`${guild.name} | ${guild.id} | ${guild.memberCount}\n`)
                })
            } else {
                return await message.reply("You are not my owner.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN GUILDLIST COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }
}