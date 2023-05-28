const guildConfig = require("../Detabase/guildConfig.js")
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = async (client, oldChannel, newChannel) => {
    try {
        const guilddata = await guildConfig.findOne({ id: newChannel.guild.id }) || {};
        if (!newChannel.guild.members.me.permissions.has("ViewAuditLog")) return
        let enrty = await (await newChannel.guild.fetchAuditLogs()).entries.find(channel => channel.actionType === 'Update' && channel.targetType === 'Channel')
        let user = newChannel.guild.members.cache.find(user => user.id === enrty.executorId)
        let changes = []
        let old = []
        let newv = []
        for (const change of enrty.changes) {
            changes.push(change.key)
            old.push(change.old || 'NONE')
            newv.push(change.new || 'NONE')
        }
        let count = 0
        let rate_limit_per_user = false
        let default_auto_archive_duration = false
        if (changes.includes('rate_limit_per_user')) {
            rate_limit_per_user = true
            count = count + 1
        }
        if (changes.includes('default_auto_archive_duration')) {
            default_auto_archive_duration = true
            count = count + 1
        }

        let f = oldChannel.type
        let oldchanneltype;
        if (f === 0) oldchanneltype = 'TEXT';
        if (f === 2) oldchanneltype = 'VOICE';
        if (f === 4) oldchanneltype = 'CATEGORY';
        if (f === 5) oldchanneltype = 'ANNOUNCEMENT';
        if (f === 10) oldchanneltype = 'ANNOUNCEMENT THREAD';
        if (f === 11) oldchanneltype = 'PUBLIC THREAD';
        if (f === 12) oldchanneltype = 'PRIVATE THREAD';
        if (f === 13) oldchanneltype = 'STAGE';
        if (f === 14) oldchanneltype = 'GUILD DIRECTORY';
        if (f === 15) oldchanneltype = 'FORUM';
        let f2 = newChannel.type
        let newchanneltype;
        if (f2 === 0) newchanneltype = 'TEXT';
        if (f2 === 2) newchanneltype = 'VOICE';
        if (f2 === 4) newchanneltype = 'CATEGORY';
        if (f2 === 5) newchanneltype = 'ANNOUNCEMENT';
        if (f2 === 10) newchanneltype = 'ANNOUNCEMENT THREAD';
        if (f2 === 11) newchanneltype = 'PUBLIC THREAD';
        if (f2 === 12) newchanneltype = 'PRIVATE THREAD';
        if (f2 === 13) newchanneltype = 'STAGE';
        if (f2 === 14) newchanneltype = 'GUILD DIRECTORY';
        if (f2 === 15) newchanneltype = 'FORUM';
        const description = async () => {
            let description = ""
            newChannel.members.map(x => {
                description = description + `<@${x.id}>`
            });
            return description
        }
        let d = await description() || 'NONE'
        if (guilddata.logs) {
            if (guilddata.channellog) {
                if (guilddata.logschannel) {
                    if (count === 1) {
                        let embed = new EmbedBuilder()
                            .setAuthor({ name: user.user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`, url: `https://discord.com/users/${user.user.id}` })
                            .setDescription(`Channel Updated <t:${Math.round(Date.now() / 1000)}>`)
                            .addFields(
                                { name: 'Name', value: `${oldChannel.name} -> ${newChannel.name}` },
                                { name: 'Moderator', value: `<@${user.id}>` },
                                { name: 'Type', value: `${oldchanneltype} -> ${newchanneltype}` },
                                { name: 'Members', value: `${d}` },
                                { name: 'NSFW', value: `${newChannel.nsfw}` },
                                { name: 'Topic', value: `${newChannel.topic || 'None'}` },
                                { name: `${changes[0]}`, value: `${old[changes.indexOf(changes[0])]} -> ${newv[changes.indexOf(changes[0])]}` }
                            )
                            .setColor("Blurple")
                            .setFooter({ text: `Channel Update Logs`, iconURL: newChannel.guild.members.me.displayAvatarURL({ dynamic: true }) })
                        let channels = newChannel.guild.channels.cache.get(guilddata.logschannel)
                        channels.send({ embeds: [embed] })
                    } else if (count === 2) {
                        let embed = new EmbedBuilder()
                            .setAuthor({ name: user.user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`, url: `https://discord.com/users/${user.user.id}` })
                            .setDescription(`Channel Updated <t:${Math.round(Date.now()/ 1000)}>`)
                            .addFields(
                                { name: 'Name', value: `${oldChannel.name} -> ${newChannel.name}` },
                                { name: 'Moderator', value: `<@${user.id}>` },
                                { name: 'Type', value: `${oldchanneltype} -> ${newchanneltype}` },
                                { name: 'Members', value: `${d}` },
                                { name: 'NSFW', value: `${newChannel.nsfw}` },
                                { name: 'Topic', value: `${newChannel.topic || 'None'}` },
                                { name: `${changes[0]}`, value: `${old[changes.indexOf(changes[0])]} -> ${newv[changes.indexOf(changes[0])]}` },
                                { name: `${changes[1]}`, value: `${old[changes.indexOf(changes[1])]} -> ${newv[changes.indexOf(changes[1])]}` }
                            )
                            .setColor("Blurple")
                            .setFooter({ text: `Channel Update Logs`, iconURL: newChannel.guild.members.me.displayAvatarURL({ dynamic: true }) })
                        let channels = newChannel.guild.channels.cache.get(guilddata.logschannel)
                        channels.send({ embeds: [embed] })
                    } else if (count === 0) {
                        let embed = new EmbedBuilder()
                            .setAuthor({ name: user.user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`, url: `https://discord.com/users/${user.user.id}` })
                            .setDescription(`Channel Updated <t:${Math.round(Date.now() / 1000)}>`)
                            .addFields(
                                { name: 'Name', value: `${oldChannel.name} -> ${newChannel.name}` },
                                { name: 'Moderator', value: `<@${user.id}>` },
                                { name: 'Type', value: `${oldchanneltype} -> ${newchanneltype}` },
                                { name: 'Members', value: `${d}` },
                                { name: 'NSFW', value: `${newChannel.nsfw}` },
                                { name: 'Topic', value: `${newChannel.topic || 'None'}` }
                            )
                            .setColor("Blurple")
                            .setFooter({ text: `Channel Update Logs`, iconURL: newChannel.guild.members.me.displayAvatarURL({ dynamic: true }) })
                        let channels = newChannel.guild.channels.cache.get(guilddata.logschannel)
                        channels.send({ embeds: [embed] })
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
            .setDescription(`ERROR IN CHANNELUPDATE EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }

}
