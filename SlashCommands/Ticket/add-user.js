const ticketdata = require("../../Detabase/tickettool.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, StringSelectMenuBuilder, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'adduser',
    description: 'Add user to ticket.',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'User you want to add to ticket!',
            required: true
        },
        {
            name: 'ticket',
            type: ApplicationCommandOptionType.Channel,
            description: 'Mention ticket channel!',
            required: true
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
             
            if (interaction.member.permissions.has("ManageRoles") || interaction.member.permissions.has("Administrator")) {
                let channel = interaction.options.getChannel("ticket").id
                let user = interaction.options.getUser("user")
                await interaction.guild.channels.cache.get(channel).permissionOverwrites.create(user, {
                    SendMessages: true,
                    ViewChannel: true
                })
                interaction.editReply({ content: 'Added user.' })
            } else {
                return await interaction.followUp("You don't have permissions to use it.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN ADD USER TICKET COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}