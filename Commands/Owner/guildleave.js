const { EmbedBuilder, Message, ButtonBuilder, ActionRowBuilder, Client, MessageFlags } = require("discord.js");

module.exports = {
    name: 'leaveguild',
    aliases: ['gleave'],
    description: "Leave bots guild",
    category: "Owner",
    /**
     * @param {Client} client
     * @param {Message} message
     */


    run: async (client, message, args) => {
        try {
            await message.reply("**RUNNING GUILD LEAVE COMMAND...**")
            if (message.author.id === '671390595184459782') {
                guildid = args.slice(0).join(' ')
                try {
                    client.guilds.cache.get(guildid).leave();
                    await message.reply("Successfully leaved guild.")
                } catch (err) {
                    await message.reply("Something went wrong.")
                    console.log(err)
                }
            } else {
                return await message.reply("You are not my owner.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN GUILDLEAVE COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }
}