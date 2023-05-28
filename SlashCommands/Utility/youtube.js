const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const database = require("../../Detabase/youtube.js")
const mongoose = require("mongoose")
const fetch = require('node-fetch')

module.exports = {
    name: 'youtube',
    description: 'Send notification whenever a new video is uploaded.',
    options: [
        {
            name: "youtubechannelurl",
            description: "Provide youtube channel url.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'discordchannel',
            description: 'Mention discord channel.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {*} color
     */
    run: async (client, interaction, args, color) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                const youtubechannel = interaction.options.getString("youtubechannelurl");
                async function channelid(url) {
                    if (url.includes('@')) {
                        const channel = url.split('/').pop();
                        const response = await fetch(`https://yt.lemnoslife.com/channels?handle=${channel}`)
                        const data = await response.json()
                        return data.items[0].id
                    } else if (url.includes('channel')) {
                        const id = url.split('/').pop();
                        return id
                    } else if (url.includes('/c/')) {
                        const channel = url.split('/').pop();
                        const response = await fetch(`https://yt.lemnoslife.com/channels?handle=@${channel}`)
                        const data = await response.json()
                        return data.items[0].id
                    } else {
                        return 'wrong url'
                    }
                }
                let iddata = await channelid(youtubechannel)
                if (iddata === 'null' || iddata === 'Null' || iddata === 'wrong url') {
                    return await interaction.editReply("Please provide a correct channel url.")
                }
                const discordchannel = interaction.options.getChannel("discordchannel")
                console.log(discordchannel.id)
                const data = await database.findOne({
                    guild: interaction.guildId
                })
                if (data) {
                    await database.findOneAndUpdate({ guild: interaction.guildId }, { youtubechannel: iddata, discordchannel: discordchannel.id })
                } else {
                    await database.create({
                        _id: new mongoose.Types.ObjectId(),
                        guild: interaction.guildId,
                        youtubechannel: iddata,
                        discordchannel: discordchannel.id
                    })
                }
                await interaction.editReply("Data added!")
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            return await interaction.editReply(`Somthing went wrong! ${err}`)
        }
    },
};