const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, ChannelType } = require('discord.js');
const { get } = require('request-promise-native')

module.exports = {
    name: 'anime',
    description: 'Get information about Anime.',
    options: [
        {
            name: 'name',
            description: "Name of Anime",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        let name = interaction.options.getString('name')

        try {
             
            let option = {
                url: `https://kitsu.io/api/edge/anime?filter[text]=${name}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Accept': 'application/vnd.api+json',
                },
                json: true
            }
            await interaction.editReply("Fetching the data for your request").then(msg => {
                get(option).then(mat => {
                    if (interaction.channel.nsfw === true) {
                        const embed = new EmbedBuilder()
                            .setTitle(mat.data[0].attributes.slug)
                            .setURL(`https://kitsu.io/anime/${mat.data[0].id}`)
                            .setThumbnail(mat.data[0].attributes.posterImage.original)
                            .setDescription(mat.data[0].attributes.synopsis)
                            .setColor("Random")
                            .addFields(
                                { name: "Status", value: mat.data[0].attributes.status },
                                { name: "Type", value: mat.data[0].attributes.showType },
                                { name: 'Published', value: mat.data[0].attributes.startDate },
                                { name: "Aired", value: `From ${mat.data[0].attributes.startDate} till ${mat.data[0].attributes.endDate || 'still'}` },
                                { name: "User Count", value: (mat.data[0].attributes.userCount).toString() },
                                { name: "Total Episods", value: `${(mat.data[0].attributes.episodeLength).toString() || '?'}` },
                                { name: "NSFW", value: (mat.data[0].attributes.nsfw).toString() },
                                { name: "Average Rating", value: `**${mat.data[0].attributes.averageRating}/100**` },
                                { name: "Rank", value: `**${mat.data[0].attributes.ratingRank}**` },
                                { name: "INFO", value: 'All data is verified and provided by kitsu.io' }
                            )
                            .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                            .setTimestamp();

                        return interaction.editReply({
                            content: 'Here is data',
                            embeds: [embed]
                        })
                    } else if (!interaction.channel.nsfw) {
                        return interaction.editReply({
                            content: "Sorry you can't search about that anime in non-nsfw channel."
                        })
                    }


                })
            })
        }
        catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN ANIME COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}