const verify = require('../Detabase/verify.js')
const config = require('../Detabase/guildConfig.js')
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, Client, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = async (client) => {
    try {
        const createuserlist = async () => {
            let userid = []
            let x = await verify.find()
            for (let i = 0; i < x.length; i++) {
                if (!userid.includes(x[i].user)) {
                    userid.push(x[i].user)
                } else if (userid.includes(x[i].user)) {
                    continue
                }
            }
            return userid
        }
        const checkend = async (userID) => {
            const data = await verify.findOne({ user: userID, verified: false })
            if (data) {
                if (data.time === Date.now() / 1000 && data.verified == false) {
                    return ['end', data.guild]
                } else if (data.time < Date.now() / 1000 && data.verified == false) {
                    return ['end', data.guild]
                } else if (data.endat !== Date.now() / 1000) {
                    return ['not yet']
                }

            } else {
                return ['not yet']
            }
        }

        const main = async () => {
            let userid = [await createuserlist()]
            userid = userid[0]
            console.log()
            for (let i = 0; i < userid.length; i++) {
                const id = userid[i]
                const check = await checkend(id)
                if (check[0] == 'not yet') {
                    continue
                } else if (check[0] == 'end') {
                    let data = await verify.findOne({ guild: check[1], user: id })
                    let data2 = await config.findOne({ id: check[1] })
                    if (!client.guilds.cache.find(guild => guild.id === check[1]).members.cache.find(member => member.id === id).roles.cache.has(data2.verifyrole)) {
                        if (data2.verifyaction == 'kick') {
                            await data.delete()
                            await client.guilds.cache.find(guild => guild.id === check[1]).members.cache.find(member => member.id === id).kick('Captcha not completed on time.')
                        } else if (data2.verifyaction == 'ban') {
                            await data.delete()
                            await client.guilds.cache.find(guild => guild.id === check[1]).members.cache.find(member => member.id === id).ban({ reason: 'Captcha not completed on time.' })
                        }
                    }
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
            .setDescription(`ERROR IN READY 5 EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }
}