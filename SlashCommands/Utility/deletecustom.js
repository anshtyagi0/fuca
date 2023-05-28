const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const schema = require('../../Detabase/custom-commands.js');

module.exports = {
    name: 'deletecustom',
    description: 'Delete custom command',
    options: [
        {
            name: 'commandname',
            description: 'Enter command name',
            type: ApplicationCommandOptionType.String,
            required: true
        },
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
             
            if (!interaction.member.permissions.has('Administrator')) return await interaction.reply({ content: "Sorry! You don't have the required permission to use this command." });
            const name = interaction.options.getString("commandname");

            if (!name) return await interaction.editReply("Please specify command name.")

            const data = await schema.findOne({
                Guild: interaction.guild.id, Command: name
            });
            if (!data) return await interaction.editReply("No such command exits.")

            await schema.findOneAndDelete({ Guild: interaction.guild.id, Command: name });
            await interaction.editReply(`Deleted ${name} from custom command.`);
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN DELETE-CUSTOM (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}