const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const guildConfig = require("../Detabase/guildConfig.js")

module.exports = async (client, message) => {
    try {
        const guilddata = await guildConfig.findOne({ id: message.guild.id }) || {};
        let enrty = await (await message.guild.fetchAuditLogs()).entries.find(msg => msg.actionType === 'Delete')
        if (guilddata.logs) {
            if (guilddata.messagelog) {
                if (guilddata.logschannel) {
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Message Deleted <t:${Math.round(Date.now() / 1000)}>`)
                        .addFields(
                            { name: 'Content', value: `${message.content || 'Unable to get content'}` },
                            { name: 'Author', value: `<@${message.author.id}>` },
                            { name: 'Channel', value: `<#${message.channelId}>` },
                            { name: 'Message Time', value: `<t:${Math.round(message.createdTimestamp / 1000)}>` },
                            { name: 'Deleted by', value: `<@${enrty.executorId}>` }
                        )
                        .setColor("Blurple")
                        .setFooter({ text: `Message Delete Logs`, iconURL: message.guild.members.me.displayAvatarURL({ dynamic: true }) })
                    let channel = message.guild.channels.cache.get(guilddata.logschannel)
                    channel.send({ embeds: [embed] })
                }
            }
        }

    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")

        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN MESSAGEDELETE EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }
}