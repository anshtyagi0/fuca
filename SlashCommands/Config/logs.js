const configs = require("../../Detabase/guildConfig.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {

    name: "log",
    description: "Manage logging system of your server",
    options: [{
        name: "enable_disable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Enable/Disable logging system",
        options: [{
            name: "enable_disable",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'ENABLE', value: 'enable' },
                { name: 'DISABLE', value: 'disable' }
            ],
            description: "Enable/Disable logging system"
        },
        {
            name: "channels",
            type: ApplicationCommandOptionType.Channel,
            required: true,
            description: "Channel for sending logs."
        }]
    }, {
        name: "channel_enable_disable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Enable/Disable channel logs.",
        options: [{
            name: "enable_disable_channel",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'ENABLE', value: 'enable' },
                { name: 'DISABLE', value: 'disable' }
            ],
            description: "Enable/Disable channel logs"
        }]
    }, {
        name: "message_enable_disable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Enable/Disable message logs",
        options: [{
            name: "enable_disable_message",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'ENABLE', value: 'enable' },
                { name: 'DISABLE', value: 'disable' }
            ],
            description: "Enable/Disable message logs"
        }]
    }, {
        name: "member_enable_disable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Enable/Disable member logs.",
        options: [{
            name: "enable_disable_member",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'ENABLE', value: 'enable' },
                { name: 'DISABLE', value: 'disable' }
            ],
            description: "Enable/Disable member logs."
        }]
    }],

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
             
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                const command = interaction.options.getSubcommand(true)
                let channel;
                if (command === 'enable_disable') {
                    channel = interaction.options.getChannel("channels").id;
                }
                const logsenable = interaction.options.getString("enable_disable")
                const channelenable = interaction.options.getString("enable_disable_channel")
                const memberenable = interaction.options.getString("enable_disable_member")
                const messageenable = interaction.options.getString("enable_disable_message")
                const data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id })
                if (command === 'enable_disable') {
                    if (logsenable === 'enable') {
                        data.logs = true
                        data.logschannel = channel
                        await data.save();
                        interaction.editReply({ content: "logs is now enabled" });
                    } else if (logsenable === 'disable') {
                        if (!data.logs) return interaction.editReply("Already disabled.")
                        data.logs = false
                        data.logschannel = channel
                        await data.save();
                        interaction.editReply({ content: "logs is now disabled" });
                    }
                } else if (command === 'channel_enable_disable') {
                    if (channelenable === 'enable') {
                        if (data.channellog) return interaction.editReply("Already enabled.")
                        data.channellog = true
                        await data.save();
                        interaction.editReply({ content: "Channel logs is now enabled" });
                    } else if (channelenable === 'disable') {
                        if (!data.channellog) return interaction.editReply("Already disabled.")
                        data.channellog = false
                        await data.save();
                        interaction.editReply({ content: "Channel logs is now disabled" });
                    }
                } else if (command === 'member_enable_disable') {
                    if (memberenable === 'enable') {
                        if (data.memberlog) return interaction.editReply("Already enabled.")
                        data.memberlog = true
                        await data.save();
                        interaction.editReply({ content: "Member logs is now enabled" });
                    } else if (memberenable === 'disable') {
                        if (!data.memberlog) return interaction.editReply("Already disabled.")
                        data.memberlog = false
                        await data.save();
                        interaction.editReply({ content: "Member logs is now disabled" });
                    }
                } else if (command === 'message_enable_disable') {
                    if (messageenable === 'enable') {
                        if (data.messagelog) return interaction.editReply("Already enabled.")
                        data.messagelog = true
                        await data.save();
                        interaction.editReply({ content: "Message logs is now enabled" });
                    } else if (messageenable === 'disable') {
                        if (!data.messagelog) return interaction.editReply("Already disabled.")
                        data.messagelog = false
                        await data.save();
                        interaction.editReply({ content: "Message logs is now disabled" });
                    }
                }

            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }

        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN XP COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}
