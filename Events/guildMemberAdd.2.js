const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const guildConfig = require("../Detabase/guildConfig.js")
const ms = require('ms')
const dayjs = require('dayjs');
const verifydata = require("../Detabase/verify.js")


module.exports = async (client, member) => {
    try {
        let data = await guildConfig.findOne({ id: member.guild.id }) || await guildConfig.create({ id: member.guild.id })
        let datauser = await verifydata.findOne({ user: member.id, guild: member.guild.id }) || await verifydata.create({ user: member.id, guild: member.guild.id })
        if (data.verify) {
            if (data.verified) {
                return await member.roles.add(data.verifyrole)
            }
            let date = new Date(Date.now() + ms(data.verifytime))
            const time = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            let finaltime = dayjs(time).valueOf() / 1000
            let code = generateRandomCaptchaCode()
            datauser.verified = false
            datauser.time = finaltime
            datauser.correct = code
            await datauser.save()
        } else {
            return
        }
    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("url")


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

function generateRandomCaptchaCode() {
    // Define a variable consisting of all lowercase and uppercase letters.
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Specify the length for the new string.
    var lenString = 5;

    // Create an empty string to hold the generated string.
    var randomstring = "";

    // Loop to select a new character in each iteration.
    for (var i = 0; i < lenString; i++) {
        // Generate a random number between 0 and the length of the characters string.
        var rnum = Math.floor(Math.random() * characters.length);

        // Add the character at the random index to the randomstring variable.
        randomstring += characters.substring(rnum, rnum + 1);
    }

    // Return the generated string.
    return randomstring;
}