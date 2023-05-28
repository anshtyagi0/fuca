const premiumScheme = require("../Detabase/premiumScheme.js");
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, Client, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');


module.exports = async (client) => {
    try {
        const createguildlist = async () => {
            let giveawayid = []
            let x = await premiumScheme.find()
            for (let i = 0; i < x.length; i++) {
                if (!giveawayid.includes(x[i].Guild)) {
                    giveawayid.push(x[i].Guild)
                } else if (giveawayid.includes(x[i].Guild)) {
                    continue
                }
            }
            return giveawayid
        }

        const checkend = async (Guild) => {
            const data = await premiumScheme.findOne({ Guild: Guild })
            if (data) {
                if (data.Permanent == true) return 'Permanent';
                if (data.Expire === Date.now()) {
                    await data.delete();
                } else if (data.Expire < Date.now()) {
                    await data.delete();
                } else if (data.Expire !== Date.now()) {
                    return 'not yet'
                }
            }
        }

        const main = async () => {
            let giveawayid = [await createguildlist()]
            giveawayid = giveawayid[0]
            for (let i = 0; i < giveawayid.length; i++) {
                const id = giveawayid[i]
                const check = await checkend(id)
            }
        }
        setInterval(main, 5000)
    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN READY 3 EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }
}
