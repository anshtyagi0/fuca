const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const afkdata = require("../../Detabase/afk.js")

module.exports = {
    name: 'afk',
    description: 'Will set you to afk.',
    options: [
        {
            name: "reason",
            description: "Reason for afk",
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
             
            const reason = interaction.options.getString("reason");
            const time = Math.round(interaction.createdTimestamp / 1000)
            const data = await afkdata.findOne({ userID: interaction.member.user.id })
            if (data) {
                return await interaction.editReply({ content: 'You are already set to akf.', ephemeral: false })
            } else if (!data) {
                await afkdata.create({
                    userID: interaction.member.user.id,
                    reason: reason,
                    timestamp: time
                })
                return await interaction.editReply({ content: `You are set to afk for: ${reason}`, ephemeral: false })
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN AFK (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
};