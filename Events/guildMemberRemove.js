const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const welcomes = require("../Detabase/leave.js")
const guildConfig = require("../Detabase/guildConfig.js")
const { createCanvas, loadImage } = require("canvas");

module.exports = async (client, member) => {
    try {
        const data = await welcomes.findOne({ id: member.guild.id }) || {};
        const guilddata = await guildConfig.findOne({ id: member.guild.id }) || {};
        if (!member.guild.members.me.permissions.has("ViewAuditLog")) {
            console.log("NO PERMS")
        } else {
            let timestamp = []
            let enrtyg = (await member.guild.fetchAuditLogs()).entries.filter(user => user.targetId === member.user.id && user.actionType === 'Delete')
            try {
                enrtyg.forEach(e => {
                    timestamp.push(e.createdTimestamp)
                });
                const highest = Math.max(...timestamp)
                let enrty = enrtyg.find(e => e.createdTimestamp === highest)
                if (guilddata.logs) {
                    if (guilddata.memberlog) {
                        if (guilddata.logschannel) {
                            if (enrty.createdTimestamp > Date.now() - 10000) {
                                if (!member.guild.bans.cache.has(member.user.id)) {
                                    let embed = new EmbedBuilder()
                                        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${member.id}` })
                                        .setDescription(`User created account <t:${Math.round(member.user.createdTimestamp / 1000)}>`)
                                        .addFields(
                                            { name: 'User', value: member.user.tag },
                                            { name: 'User ID', value: member.user.id },
                                            { name: 'Type', value: 'KICKED' },
                                            { name: 'Moderator', value: `<@${enrty.executorId}>` },
                                            { name: 'Reason', value: enrty.reason || 'NONE' }
                                        )
                                        .setColor("Blurple")
                                        .setFooter({ text: `Member Kick Logs`, iconURL: member.guild.members.me.displayAvatarURL({ dynamic: true }) })
                                    let channel = member.guild.channels.cache.get(guilddata.logschannel)
                                    channel.send({ embeds: [embed] })
                                } else if (member.guild.bans.cache.has(member.user.id)) {
                                    console.log('Banned')
                                }
                            } else {
                                let embed = new EmbedBuilder()
                                    .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${member.id}` })
                                    .setDescription(`User created account <t:${Math.round(member.user.createdTimestamp / 1000)}>`)
                                    .addFields(
                                        { name: 'User', value: member.user.tag },
                                        { name: 'User ID', value: member.user.id },
                                        { name: 'Type', value: 'LEFT' },
                                    )
                                    .setColor("Blurple")
                                    .setFooter({ text: `Member Left Logs`, iconURL: member.guild.members.me.displayAvatarURL({ dynamic: true }) })
                                let channel = member.guild.channels.cache.get(guilddata.logschannel)
                                channel.send({ embeds: [embed] })
                            }
                        }
                    }
                }
            } catch (err) {
                let embed = new EmbedBuilder()
                    .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${member.id}` })
                    .setDescription(`User created account <t:${Math.round(member.user.createdTimestamp / 1000)}>`)
                    .addFields(
                        { name: 'User', value: member.user.tag },
                        { name: 'User ID', value: member.user.id },
                        { name: 'Type', value: 'LEFT' },
                    )
                    .setColor("Blurple")
                    .setFooter({ text: `Member Left Logs`, iconURL: member.guild.members.me.displayAvatarURL({ dynamic: true }) })
                let channel = member.guild.channels.cache.get(guilddata.logschannel)
                channel.send({ embeds: [embed] })
            }
        }
        if (!data.enable) return;
        let channel = member.guild.channels.cache.get(data.channel);
        if (!channel) return;
        const canvas = createCanvas(1024, 470)
        ctx = canvas.getContext('2d')
        ctx.font = '72px sans-serif';
        const url = data.bgimage
        let bg = await loadImage(url)
        ctx.drawImage(bg, 0, 0, 1024, 500)
        ctx.fillStyle = '#fe5701'
        ctx.fillText("LEFT", 360, 360);
        ctx.beginPath();
        ctx.arc(512, 166, 128, 0, Math.PI * 2, true);
        ctx.stroke()
        ctx.fill()


        ctx.font = '42px sans-serif'
        ctx.fillStyle = '#fe5701'
        ctx.textAlign = 'center';
        ctx.fillText(member.user.tag.toUpperCase(), 512, 410)
        ctx.font = '32px sans serif'
        ctx.fillStyle = '#fe5701'
        ctx.fillText(`Now we have ${member.guild.memberCount} Members.`, 512, 455)
        ctx.beginPath()
        ctx.arc(512, 166, 118, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        await loadImage(member.user.displayAvatarURL({ extension: 'png', sizq: 1024 }))
            .then(img => {
                ctx.drawImage(img, 393, 47, 238, 238);
            })
        let atta = new AttachmentBuilder(canvas.toBuffer(), `welcome-${member.id}.png`)
        try {
            reply(data.message, channel, data, member, atta)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN MEMBERREMOVE EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }

}

function reply(content, channel, data, member, attach) {
    if (!data.enable) return;

    channel.send({ content: content.replace(/{mention}/g, member.user.username).replace(/{guild}/, member.guild.name), files: [attach] });
}
