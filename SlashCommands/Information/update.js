const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const webhook = require('webhook-discord')
const Hook = new webhook.Webhook('https://discord.com/api/webhooks/973260474374311947/g8YWusZyMUyLL48Ar2hBvCzbWnxvRXPEJo31huigEIhokNFbf7NSTPjxWbzQK4nhjGA7');

module.exports = {
    name: 'update',
    description: 'Will tell about latest update.',

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });

        if (interaction.member.user.id == '671390595184459782') {
            const msg = new webhook.MessageBuilder()
                .setName("UPDATE")
                .setAvatar('https://fuca.fluiddev.xyz/assets/img/logo-modified.png')
                .setTitle("New Update")
                .setDescription("New update of <@1019613932211675237> has been released.")
                .addField("Version", '1.1.9')
                .addField("What's new?", 'ADDED RPS GAME\nADDED JOKES COMMAND.')
                .setColor("#0000FF")
                .setFooter('Copyright © Fuca')
            await Hook.send(msg)
            await interaction.editReply("Done")
        } else {
            const msg = new EmbedBuilder()
                .setTitle("Last update (1.1.9)")
                .setColor('Blurple')
                .addFields({ name: "What's new?", value: 'ADDED RPS GAME\nADDED JOKES COMMAND.' })
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
            await interaction.editReply({ embeds: [msg] })
        }
    }
}