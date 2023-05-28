const { EmbedBuilder, Message, ButtonBuilder, ActionRowBuilder, Client, MessageFlags } = require("discord.js");

module.exports = {
    name: 'changeavatar',
    aliases: ['cab'],
    description: "Change this bots avatar.",
    category: "Owner",
    /**
     * @param {Client} client
     * @param {Message} message
     */


    run: async (client, message, args) => {
        try {
            await message.reply("**RUNNING CHANGE AVATAR COMMAND...**")
            if (message.author.id === '671390595184459782') {
                let image = args.slice(0).join(' ')
                console.log(image)
                client.user.setAvatar(image);
                await message.reply("Successfully changed avatar.")
            } else {
                return await message.reply("You are not my owner.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN CHANGEAVATAR COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }
}