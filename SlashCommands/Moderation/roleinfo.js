const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'roleinfo',
    description: 'Will give information about role.',
    options: [
        {
            name: 'role',
            description: 'Mention role you want to know about.',
            required: true,
            type: ApplicationCommandOptionType.Role
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
        try {
             
            const role = interaction.options.getRole("role")
            if (!role) return await interaction.editReply("Please provide a role to get information.")

            const embed = new EmbedBuilder()
                .setTitle('Role Info')
                .setColor(`${role.hexColor}`)
                .addFields(
                    { name: "Role name", value: (role.name).toString() },
                    { name: "Role ID", value: (role.id).toString() },
                    { name: "Users in role", value: (role.members.size).toString() },
                    { name: "Mentionable", value: (role.mentionable).toString() },
                    { name: "Color", value: (role.hexColor).toString() }
                )
                .setFooter({ text: `Role created at` })
                .setTimestamp(role.createdTimestamp)

            await interaction.editReply({ embeds: [embed] })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN ROLEINFO (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
