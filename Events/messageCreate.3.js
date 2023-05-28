const { EmbedBuilder, Message, Client, PermissionsBitField } = require("discord.js");
const afkdata = require('../Detabase/afk.js')
const guilddata = require('../Detabase/guildConfig.js')

module.exports = async (client, message) => {
    /**
     * @param {Client} client
     * @param {Message} message
     */
    try {
        if (message.webhookId) return;
        if (!message.guild) return;
        let linkda = await guilddata.findOne({ id: message.guild.id }) || await guilddata.create({ id: message.guild.id })
        if (linkda.antilink === true && !linkda?.ignorelink?.includes(message.channel.id)) {
            if (message.member.permissions.has('Administrator')) {
                console.log("Allowed")
            } else if (!message.member.permissions.has('Administrator')) {
                if (message.content.includes("https://")) {
                    message.delete(1);
                    message.channel.send({ content: `Links not allowed, <@${message.author.id}>` })
                }
                if (message.content.includes("http://")) {
                    message.delete(1);
                    message.channel.send({ content: `Links not allowed, <@${message.author.id}>` })
                }
                if (message.content.includes("www.")) {
                    message.delete(1);
                    message.channel.send({ content: `Links not allowed, <@${message.author.id}>` })
                }
            }
        }
        if (linkda.antiword === true) {
            let list = []
            let words = linkda.words.filter(x => list.push(x.word))
            let a=0;
            for (const word of list) {
                if ((message.content).toLowerCase().includes(word)) {
                    a+=1
                }
            }
            if (a>0) {
                message.delete(1)
                message.channel.send({ content: `That word is not allowed, <@${message.author.id}>` })
            }
        }
        try {
            const data = await afkdata.findOne({ userID: (message.mentions.members.first()).id })
            if (!data) return;
            if (message.author.id === data.userID) {
                return data.delete()
            }
            const member = message.guild.members.cache.get(data.userID)
            message.reply(`${member.username} is AFK. Reason: ${data.reason} from <t:${data.timestamp}>`)
        } catch (err) {
            const data = await afkdata.findOne({ userID: message.author.id })
            if (!data) return;
            if (message.author.id === data.userID) {
                return data.delete()
            }
            const member = message.guild.members.cache.get(data.userID)
            message.reply(`${member.username} is AFK. Reason: ${data.reason} from <t:${data.timestamp}>`)
        }
    } catch (err) {
        return console.log(err)
    }
}
