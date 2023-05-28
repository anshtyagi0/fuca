const pre = require("../../Detabase/prefix.js");
const mongoose = require('mongoose')
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');

module.exports = {
    name: 'setprefix',
    description: 'change prefix for your server.',
    options: [
        {
            name: 'newprefix',
            description: 'The new prefix you want.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
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
             
            if (!interaction.member.permissions.has("Administrator")) return await interaction.editReply("You don't have permissions to use it.")
            const data = pre.findOne({ guildid: interaction.guildId })
            const newPrefix = interaction.options.getString('newprefix');

            if (data) {
                await pre.findOneAndUpdate(({ guildid: interaction.guildId }, { prefix: newPrefix }))
            } else {
                await pre.create({
                    _id: new mongoose.Types.ObjectId(),
                    guildid: interaction.guildId,
                    prefix: newPrefix
                })
            }

            await interaction.editReply({ content: `Changed prefix for this server to: ${newPrefix}`, ephemeral: false })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN SETPREFIX COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong: ${err}`)
        }
    }
}