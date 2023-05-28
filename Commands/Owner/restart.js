const Discord = require('discord.js');

module.exports = {
    name: "restart",
    aliases: ['reboot'],
    description: "Will restart bot.",
    category: "Owner",
    example: ["restart"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */

    run: async (client, message, args) => {
        try {
            if (message.author.id === '671390595184459782') {
                await message.reply("Restarting...").then((msg) => {
                    process.exit();
                })

            } else {
                return;
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN RESTART COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }

}