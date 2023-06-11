const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const reports = require('../../Detabase/report.js')

module.exports = {
    name: 'support',
    description: 'Support server link.',

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
                .setDescription("Click the button below to join support server!")
            let btnraw = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Support server").setURL(`https://discord.gg/v8YSWmF88v`),
            ])
            await interaction.editReply({
                embeds: [embed],
                components: [btnraw]
            });
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN support (Slash) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}