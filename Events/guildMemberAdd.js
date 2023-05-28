const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const welcomes = require("../Detabase/welcome.js")
const guildConfig = require("../Detabase/guildConfig.js")
const { createCanvas, loadImage } = require("canvas");

module.exports = async (client, member) => {
    try {
        const data = await welcomes.findOne({ id: member.guild.id }) || {};
        const guilddata = await guildConfig.findOne({ id: member.guild.id }) || {};
        if (guilddata.logs) {
            if (guilddata.memberlog) {
                if (guilddata.logschannel) {
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${member.id}` })
                        .setDescription(`User created account <t:${Math.round(member.user.createdTimestamp / 1000)}>`)
                        .addFields(
                            { name: 'User', value: member.user.tag },
                            { name: 'User ID', value: member.user.id }
                        )
                        .setColor("Blurple")
                        .setFooter({ text: `Member Join Logs`, iconURL: member.guild.members.me.displayAvatarURL({ dynamic: true })})
                    let channel = member.guild.channels.cache.get(guilddata.logschannel)
                    channel.send({ embeds: [embed]})
                }
            }
        }
        if (!data.enable) return;
        try {
            let addrole = member.guild.roles.cache.find(role => role.id == data.roleid)
            if (!addrole) console.log("no auto role.");
            await member.roles.add(addrole)
        } catch (err) {
            console.log(err)
        }
        let channel = member.guild.channels.cache.get(data.channel);
        if (!channel) return;
        const canvas = createCanvas(1024, 470)
        ctx = canvas.getContext('2d')
        ctx.font = '72px sans-serif';
        const url = data.bgimage
        let bg = await loadImage(url)
        ctx.drawImage(bg, 0, 0, 1024, 500)
        ctx.fillStyle = '#fe5701'
        ctx.fillText("WELCOME", 360, 360);
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
        ctx.fillText(`You are the ${member.guild.memberCount}th Member.`, 512, 455)
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
            .setDescription(`ERROR IN MEMBERADD EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }

}

function reply(content, channel, data, member, attach) {
    if (!data.enable) return;

    channel.send({ content: content.replace(/{mention}/g, member).replace(/{guild}/, member.guild.name), files: [attach] });
}
