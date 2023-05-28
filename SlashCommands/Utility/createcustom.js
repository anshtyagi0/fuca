const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const schema = require('../../Detabase/custom-commands.js');

module.exports = {
    name: 'createcustom',
    description: 'Create custom command',
    options: [
        {
            name: 'commandname',
            description: 'Enter command name',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'response',
            description: 'what will be the response? Like: hi',
            type: ApplicationCommandOptionType.String,
            required: true
        }
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
             
            if (!interaction.member.permissions.has('Administrator')) return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." });
            const name = interaction.options.getString("commandname"); const response = interaction.options.getString("response")
            const desault = await client.commands.get(name);
            if (desault) return await interaction.editReply("You can't use that command name. Please try something else.")

            if (!name) return await interaction.editReply("Please specify command name.")
            if (!response) return await interaction.editReply("Please specify the response for command.")

            const data = await schema.findOne({
                Guild: interaction.guild.id, Command: name
            });
            if (data) return await interaction.editReply("This custom command already exists.")

            const newdata = new schema({
                Guild: interaction.guild.id,
                Command: name,
                Response: response
            })
            await newdata.save();

            await interaction.editReply(`Saved ${name} as custom command.`);
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN CREATE-CUSTOM (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}