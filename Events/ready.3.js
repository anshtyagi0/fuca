const giveawaydata = require("../Detabase/giveaway.js")
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, Client, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');


module.exports = async (client) => {
    try {
        const creategivelist = async () => {
            let giveawayid = []
            let x = await giveawaydata.find()
            for (let i = 0; i < x.length; i++) {
                if (!giveawayid.includes(x[i].messageID)) {
                    giveawayid.push(x[i].messageID)
                } else if (giveawayid.includes(x[i].messageID)) {
                    continue
                }
            }
            return giveawayid
        }

        const checkend = async (messageID) => {
            const data = await giveawaydata.findOne({ messageID: messageID })
            if (data) {
                if (data.active == false) return 'Already end';
                if (data.endat === Date.now() / 1000) {
                    data.active = false
                    await data.save();
                    return 'end'
                } else if (data.pause === true) {
                    return 'paused'
                } else if (data.endat < Date.now() / 1000) {
                    data.active = false
                    await data.save();
                    return 'end'
                } else if (data.endat !== Date.now() / 1000) {
                    return 'not yet'
                }

            }
        }

        const main = async () => {
            let giveawayid = [await creategivelist()]
            giveawayid = giveawayid[0]
            for (let i = 0; i < giveawayid.length; i++) {
                const id = giveawayid[i]
                const check = await checkend(id)
                if (check == 'Already end') {
                    continue
                } else if (check == 'paused') {
                    continue
                } else if (check == 'not yet') {
                    continue
                } else if (check == 'end') {
                    const data = await giveawaydata.findOne({ messageID: id })
                    const winners = data.userlist.sort(() => Math.random() - 0.5).slice(0, data.winners);
                    let list = winners.map(entry => entry.id).join(', ').split(', ');
                    let mentions;
                    if (data.winner == '1') {
                        mentions = `<@${list}>`
                    } else {
                        mentions = list.map(id => `<@${id}>`).join(', ');
                    }
                    if (mentions == '<@>') {
                        data.winner = 'None'
                        await data.save();
                        let channels = await client.channels.cache.get(data.channelID)
                        let msg = await channels.messages.fetch(id)
                        await msg.reply({ content: `No one participated ${data.title}` })
                        const embed = new EmbedBuilder()
                            .setTitle(data.title)
                            .setDescription("Giveaway Ended!")
                            .addFields(
                                { name: 'HOST', value: `<@${data.host}>` },
                                { name: 'Ends in', value: 'Ended' },
                                { name: 'Winner', value: 'None' },
                                { name: 'Users', value: data.users }
                            )
                        let msgbutton = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId("ENTER-GIVEAWAY").setLabel("🎉 ENTER").setStyle(ButtonStyle.Success).setDisabled(true)
                        ])
                        return msg.edit({
                            embeds: [embed],
                            components: [msgbutton]
                        })
                    }
                    data.winner = mentions
                    await data.save();
                    let channels = await client.channels.cache.get(data.channelID)
                    let msg = await channels.messages.fetch(id)
                    await msg.reply({ content: `Congratulations ${mentions}, you won ${data.title}` })
                    const embed = new EmbedBuilder()
                        .setTitle(data.title)
                        .setDescription("Giveaway Ended!")
                        .addFields(
                            { name: 'HOST', value: `<@${data.host}>` },
                            { name: 'Ends in', value: 'Ended' },
                            { name: 'Winner', value: data.winner },
                            { name: 'Users', value: data.users }
                        )
                    let msgbutton = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId("ENTER-GIVEAWAY").setLabel("🎉 ENTER").setStyle(ButtonStyle.Success).setDisabled(true)
                    ])
                    return msg.edit({
                        embeds: [embed],
                        components: [msgbutton]
                    })
                }
            }
        }
        setInterval(main, 5000)
    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("url")


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
