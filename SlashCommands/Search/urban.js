const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch')
const queryString = require('query-string')

module.exports = {
    name: 'urban',
    description: 'Get urban meaning of word.',
    options: [
        {
            name: 'word',
            description: "Word",
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
        let word = interaction.options.getString('word')

        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?term=${word}`).then(response => response.json())
        try {
             
            const [answer] = list
            const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str)
            const embed = new EmbedBuilder()
                .setTitle(answer.word)
                .setURL(answer.permalink)
                .addFields(
                    { name: "Definition", value: trim(answer.definition, 1024) },
                    { name: "Example", value: trim(answer.example, 1024) },
                    { name: "Rating", value: `${answer.thumbs_up} 👍 || ${answer.thumbs_down} 👎` }
                )
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })

            await interaction.editReply({ embeds: [embed] })
        }
        catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN URBAN COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong here is error: ${err}`)
        }
    }
}