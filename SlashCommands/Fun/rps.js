const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, StringSelectMenuBuilder, Events } = require('discord.js');

module.exports = {
    name: "rps",
    description: "Rock Paper Scissors game.",
    options: [
        {
            name: 'choice',
            description: 'Your choice',
            required: true,
            type: ApplicationCommandOptionType.Number,
            choices: [
                { name: 'ROCK', value: 0 },
                { name: 'PAPER', value: 1 },
                { name: 'SCISSORS', value: 2 }
            ],
        }
    ],
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

        let option = ['ROCK', 'PAPER', 'SCISSOR']
        let choice = interaction.options.getNumber('choice')
        let computer = getRandomNumber()
        if (choice == computer) return interaction.editReply({ content: `It's a tie.\nYour Choice: **${option[choice]}**\nClient's Choice: **${option[computer]}**` })
        if (choice == 0 && computer == 1) return interaction.editReply({ content: `You lost.\nYour Choice: **${option[choice]}**\nClient's Choice: **${option[computer]}**` })
        if (choice == 0 && computer == 2) return interaction.editReply({ content: `You Won.\nYour Choice: **${option[choice]}**\nClient's Choice: **${option[computer]}**` })
        if (choice == 1 && computer == 0) return interaction.editReply({ content: `You Won.\nYour Choice: **${option[choice]}**\nClient's Choice: **${option[computer]}**` })
        if (choice == 1 && computer == 2) return interaction.editReply({ content: `You lost.\nYour Choice: **${option[choice]}**\nClient's Choice: **${option[computer]}**` })
        if (choice == 2 && computer == 0) return interaction.editReply({ content: `You lost.\nYour Choice: **${option[choice]}**\nClient's Choice: **${option[computer]}**` })
        if (choice == 2 && computer == 1) return interaction.editReply({ content: `You Won.\nYour Choice: **${option[choice]}**\nClient's Choice: **${option[computer]}**` })

    }
};
function getRandomNumber() {
    return Math.floor(Math.random() * 3); // 0, 1, or 2
}