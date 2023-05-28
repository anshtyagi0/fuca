const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Will send my invitelink.',

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            const embed = new EmbedBuilder()
                .setTimestamp()
                .setColor(interaction.member.displayHexColor)
                .setDescription("Click the button below to invite me!")
            let btnraw = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Invite Link").setURL(`https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Ffuca.fluiddev.xyz&permissions=1099511627775&client_id=1019613932211675237&scope=bot%20applications.commands`),
            ])
            await interaction.editReply({
                embeds: [embed],
                components: [btnraw]

            })
        } catch (err) {
            await interaction.editReply(`Something went wrong: ${err}`)
        }
    }
}