const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const schema = require('../../Detabase/custom-commands.js');

module.exports = {
    name: 'listcustom',
    description: 'List of custom commands',
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
             
            const data = await schema.find({ Guild: interaction.guild.id })
            if (!!data == false) return await interaction.editReply("There is no custom command for this guild.");
            const embed = new EmbedBuilder()
                .setTitle("Custom Commands")
                .setColor("Random")
                .setDescription(
                    data.map((cmd, i) =>
                        `${i + 1}: ${cmd.Command}`
                    ).join('\n')
                )
            await interaction.editReply({ embeds: [embed] })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN lIST-CUSTOM (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}