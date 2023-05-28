const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, StringSelectMenuBuilder, Events, Colors } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "jokes",
    description: "Get random jokes on any prompt.",

    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch(`https://official-joke-api.appspot.com/random_joke`, options)
            .then(response => response.json())
            .then(data => {
                let embed = new EmbedBuilder()
                    .setTitle(`${data.type} Jokes`)
                    .addFields(
                        { name: 'Setup', value: data.setup },
                        { name: 'Punchline', value: data.punchline }
                    )
                    .setColor(Colors.Blurple)
                    .setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                interaction.editReply({ embeds: [embed] })
            })
            .catch(error => {
                console.error('Error:', error);
            });


    }
};
