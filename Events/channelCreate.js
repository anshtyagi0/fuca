const guildConfig = require("../Detabase/guildConfig.js")
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = async (client, channel) => {
    try {
        const guilddata = await guildConfig.findOne({ id: channel.guild.id }) || {};
        if (!channel.guild.members.me.permissions.has("ViewAuditLog")) return
        let enrty = await (await channel.guild.fetchAuditLogs()).entries.find(channel => channel.actionType === 'Create' && channel.targetType === 'Channel')
        let user = channel.guild.members.cache.find(user => user.id === enrty.executorId)
        let f = enrty.changes.find(change => change.key === 'type').new
        let channeltype;
        if (f === 0) channeltype = 'TEXT';
        if (f === 2) channeltype = 'VOICE';
        if (f === 4) channeltype = 'CATEGORY';
        if (f === 5) channeltype = 'ANNOUNCEMENT';
        if (f === 10) channeltype = 'ANNOUNCEMENT THREAD';
        if (f === 11) channeltype = 'PUBLIC THREAD';
        if (f === 12) channeltype = 'PRIVATE THREAD';
        if (f === 13) channeltype = 'STAGE';
        if (f === 14) channeltype = 'GUILD DIRECTORY';
        if (f === 15) channeltype = 'FORUM';
        if (guilddata.logs) {
            if (guilddata.channellog) {
                if (guilddata.logschannel) {
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: user.user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`, url: `https://discord.com/users/${user.user.id}` })
                        .setDescription(`New Channel created <t:${Math.round(channel.createdTimestamp / 1000)}>`)
                        .addFields(
                            { name: 'Channel Name', value: enrty.target.name },
                            { name: 'Channel', value: `<#${enrty.target.id}>` },
                            { name: 'Type', value: `${channeltype || None}` },
                            { name: 'Moderator', value: `<@${user.id}>` }
                        )
                        .setColor("Blurple")
                        .setFooter({ text: `Channel Created Logs`, iconURL: channel.guild.members.me.displayAvatarURL({ dynamic: true }) })
                    let channels = channel.guild.channels.cache.get(guilddata.logschannel)
                    channels.send({ embeds: [embed] })
                }
            }
        }
    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN CHANNELCREATE EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }

}
