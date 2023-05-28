const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const guildConfig = require("../Detabase/guildConfig.js")

module.exports = async (client, oldMember, newMember) => {
    try {
        const guilddata = await guildConfig.findOne({ id: newMember.guild.id }) || {};
        if (!newMember.guild.members.me.permissions.has("ViewAuditLog")) {
            console.log("NO PERMS")
        } else {
            let enrty = await (await newMember.guild.fetchAuditLogs()).entries.find(user => user.targetId === newMember.id && user.actionType === 'Update')
            if (enrty.changes.find(c => c.key === '$add') || enrty.changes.find(c => c.key === '$remove')) {
                if (enrty.changes.find(c => c.key === '$add')) {
                    let rolechange = enrty.changes.find(c => c.key === '$add');
                    let addrole = rolechange.new[0].id
                    if (guilddata.logs) {
                        if (guilddata.memberlog) {
                            if (guilddata.logschannel) {
                                if (enrty) {
                                    let embed = new EmbedBuilder()
                                        .setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${newMember.id}` })
                                        .setDescription(`Member Role Added <t:${Math.round(Date.now() / 1000)}>`)
                                        .addFields(
                                            { name: 'User', value: newMember.user.tag },
                                            { name: 'User ID', value: `<@${newMember.id}>(${newMember.id})` },
                                            { name: 'Role', value: `<@&${addrole}>(${addrole})` }
                                        )
                                        .setColor("Blurple")
                                        .setFooter({ text: `Member Update Logs`, iconURL: newMember.guild.members.me.displayAvatarURL({ dynamic: true }) })
                                    let channel = newMember.guild.channels.cache.get(guilddata.logschannel)
                                    channel.send({ embeds: [embed] })
                                }
                            }
                        }
                    }
                } else if (enrty.changes.find(c => c.key === '$remove')) {
                    let rolechange = enrty.changes.find(c => c.key === '$remove');
                    let addrole = rolechange.new[0].id
                    if (guilddata.logs) {
                        if (guilddata.memberlog) {
                            if (guilddata.logschannel) {
                                if (enrty) {
                                    let embed = new EmbedBuilder()
                                        .setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${newMember.id}` })
                                        .setDescription(`Member Role Removed <t:${Math.round(Date.now() / 1000)}>`)
                                        .addFields(
                                            { name: 'User', value: newMember.user.tag },
                                            { name: 'User ID', value: `<@${newMember.user.id}>(${newMember.user.id})` },
                                            { name: 'Role', value: `<@&${addrole}>(${addrole})` }
                                        )
                                        .setColor("Blurple")
                                        .setFooter({ text: `Member Update Logs`, iconURL: newMember.guild.members.me.displayAvatarURL({ dynamic: true }) })
                                    let channel = newMember.guild.channels.cache.get(guilddata.logschannel)
                                    channel.send({ embeds: [embed] })
                                }
                            }
                        }
                    }
                }
            }
            else if (enrty.changes.find(c => c.key === 'nick')) {
                if (guilddata.logs) {
                    if (guilddata.memberlog) {
                        if (guilddata.logschannel) {
                            if (enrty) {
                                let embed = new EmbedBuilder()
                                    .setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${newMember.id}` })
                                    .setDescription(`Member Nickname Changed <t:${Math.round(Date.now() / 1000)}>`)
                                    .addFields(
                                        { name: 'User', value: newMember.user.tag },
                                        { name: 'User ID', value: `<@${newMember.user.id}>(${newMember.user.id})` },
                                        { name: 'Old Nickname', value: `${oldMember.nickname}` },
                                        { name: 'New Nickname', value: `${newMember.nickname}` }
                                    )
                                    .setColor("Blurple")
                                    .setFooter({ text: `Member Update Logs`, iconURL: newMember.guild.members.me.displayAvatarURL({ dynamic: true }) })
                                let channel = newMember.guild.channels.cache.get(guilddata.logschannel)
                                channel.send({ embeds: [embed] })
                            }
                        }
                    }
                }
            }
        }

    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN MEMBERUPDATE EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }

}