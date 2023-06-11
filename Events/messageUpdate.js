const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const guildConfig = require("../Detabase/guildConfig.js")

module.exports = async (client, oldMessage, newMessage) => {
    try {
        const guilddata = await guildConfig.findOne({ id: newMessage.guild.id }) || {};
        if (guilddata.logs) {
            if (guilddata.messagelog) {
                if (guilddata.logschannel) {
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: `${newMessage.author.tag}`, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Message Edited <t:${Math.round(Date.now() / 1000)}>`)
                        .addFields(
                            { name: 'Old Content', value: `${oldMessage.content || 'Unable to get content'}` },
                            { name: 'New Content', value: `${newMessage.content || 'Unable to get content'}` },
                            { name: 'Author', value: `<@${newMessage.author.id}>` },
                            { name: 'Channel', value: `<#${newMessage.channelId}>` },
                            { name: 'Message Time', value: `<t:${Math.round(oldMessage.createdTimestamp / 1000)}>` },
                        )
                        .setColor("Blurple")
                        .setFooter({ text: `Message Update Logs`, iconURL: newMessage.guild.members.me.displayAvatarURL({ dynamic: true }) })
                    let channel = newMessage.guild.channels.cache.get(guilddata.logschannel)
                    channel.send({ embeds: [embed] })

                }
            }
        }

    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("url")


        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN MESSAGEUPDATE EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }

}