const premiumScheme = require("../../Detabase/giftcode.js");
const day = require('dayjs')
const { EmbedBuilder, Message, Client } = require("discord.js");

module.exports = {
    name: 'generate',
    description: 'Generate Code.',
    category: "Owner",

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message, args) => {
        try {
            if (message.author.id !== '671390595184459782') return;

            if (!args[0]) return message.reply("When will premium expire time missing. 1, 2, 3 (months)")
            let month = 30 * 24 * 60 * 60 * 1000;
            let expire = new Date(Date.now() + (args[0] * month));
            let code = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 10; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            premiumScheme.findOne({ code: code }, async (err, data) => {
                if (data) data.delete();
                new premiumScheme({
                    code: code,
                    Expire: expire,
                }).save();
                message.reply(`Code: ${code}`)
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