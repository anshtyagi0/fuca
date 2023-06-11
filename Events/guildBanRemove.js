const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const welcomes = require("../Detabase/leave.js")
const guildConfig = require("../Detabase/guildConfig.js")

module.exports = async (client, ban) => {
    try {
        const guilddata = await guildConfig.findOne({ id: ban.guild.id }) || {};
        if (!ban.guild.members.me.permissions.has("ViewAuditLog")) {
            console.log("NO PERMS")
        } else {
            let enrty = await (await ban.guild.fetchAuditLogs()).entries.find(user => user.targetId === ban.user.id && user.actionType === 'Create')
            if (guilddata.logs) {
                if (guilddata.memberlog) {
                    if (guilddata.logschannel) {
                        if (enrty) {
                            let embed = new EmbedBuilder()
                                .setAuthor({ name: ban.user.username, iconURL: ban.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${ban.user.id}` })
                                .setDescription(`Unbanned <t:${Math.round(Date.now() / 1000)}>`)
                                .addFields(
                                    { name: 'User', value: ban.user.tag },
                                    { name: 'User ID', value: ban.user.id },
                                    { name: 'Type', value: 'UNBANNED' },
                                    { name: 'Moderator', value: `<@${enrty.executorId}>` },
                                )
                                .setColor("Blurple")
                                .setFooter({ text: `Member Unban Logs`, iconURL: ban.guild.members.me.displayAvatarURL({ dynamic: true }) })
                            let channel = ban.guild.channels.cache.get(guilddata.logschannel)
                            channel.send({ embeds: [embed] })
                        }
                    }
                }
            }
        }

    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("url")


        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN BANADD EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }

}