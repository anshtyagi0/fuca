const app = require('express').Router();
const client = require('../../index.js')
const transcriptdata = require("../../Detabase/transcript.js")
const { CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, StringSelectMenuBuilder, ApplicationCommandOptionType, ButtonStyle, ChannelType } = require('discord.js');

app.get("/transcript/:guildId/:userid/:channelid", async (req, res) => {
    let guildid = req.params.guildId
    let userid = req.params.userid
    res.setHeader("Content-Type", "text/html")
    let channelid = req.params.channelid
    let link = `https://fuca.fluiddev.xyz/transcript/${guildid}/${userid}/${channelid}`
    let data = await transcriptdata.findOne({ link: link })
    if (data) {
        return res.send(data.content)
    } else {
        return res.redirect('https://fuca.fluiddev.xyz/404')
    }
})


module.exports = app;