const welcomes = require("../../Detabase/leave.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'When Member leaves server.',
    options: [{
        name: 'enable',
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Enable leave system for your server.'
    }, {
        name: 'disable',
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Disable to leave system.'
    }, {
        name: 'message',
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Change leave message. You can use {mention} and {guild}',
        options: [{
            name: 'message',
            type: ApplicationCommandOptionType.String,
            required: true,
            description: 'This will be you new leave messagee'
        }]
    }, {
        name: 'channel',
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Channel where leave message should be sent.',
        options: [{
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'Mention the channel or give id',
            required: true
        }]
    }, {
        name: 'background',
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Add a custom background image to leave message.',
        options: [{
            name: 'url',
            type: ApplicationCommandOptionType.String,
            required: true,
            description: 'Enter url of image (png or jpeg only)'
        }]
    }]
    ,

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            await interaction.editReply({ content: `${client.user.username} is thinking...` });
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {

                const option = interaction.options.getSubcommand(true).toLowerCase(),
                    data = await welcomes.findOne({ id: interaction.guild.id }) || await welcomes.create({ id: interaction.guild.id });

                const message = interaction.options.getString("message"),
                    channel = interaction.options.get("channel")?.value,
                    bg = interaction.options.getString("url");

                if (option === 'enable') {
                    if (data.enable) return interaction.editReply({ content: 'leave system is already enabled.' });

                    await welcomes.findOneAndUpdate({ id: interaction.guild.id }, { enable: true })
                    interaction.editReply({ content: 'Enabled leave system please setup channel now.' })
                } else if (option === 'disable') {
                    if (!data.enable) return interaction.editReply({ content: 'leave system is already disabled.' });

                    await welcomes.findOneAndUpdate({ id: interaction.guild.id }, { enable: false })
                    interaction.editReply({ content: 'Disabled leave system.' })
                } else if (option === 'message') {
                    await welcomes.findOneAndUpdate({ id: interaction.guild.id }, { message: message })
                    interaction.editReply({ content: 'Changed leave message.' })
                } else if (option === 'channel') {
                    let c = interaction.guild.channels.cache.get(channel) || interaction.guild.channels.cache.get(channel.substring(2, channel.length - 1))
                    await welcomes.findOneAndUpdate({ id: interaction.guild.id }, { channel: c.id })
                    interaction.editReply({ content: 'Changed leave message channel.' })
                } else if (option === 'background') {
                    await welcomes.findOneAndUpdate({ id: interaction.guild.id }, { bgimage: bg })
                    interaction.editReply({ content: 'Changed background image.' })
                }
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN LEAVE COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}