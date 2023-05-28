const ticketdata = require("../../Detabase/tickettool.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ChannelType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ticket',
    description: 'Setup ticket system for server.',
    options: [
        {
            name: 'name',
            description: 'Name of panel default Support Ticket',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'role',
            description: 'Moderator role. Default all roles with Admin perms',
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: 'category',
            description: 'Category in which tickets will be added. Default: none',
            type: ApplicationCommandOptionType.Channel,
            channelType: ChannelType.GuildCategory,
            required: false
        },
        {
            name: "transcript",
            description: 'Channel where all transcripts will be sent after ticket is closed. Default: None',
            type: ApplicationCommandOptionType.Channel,
            required: false
        },
        {
            name: "channel",
            description: "Channel where this panel will be sent.",
            type: ApplicationCommandOptionType.Channel,
            required: false
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
                const data1 = await ticketdata.findOne({ guildId: interaction.guild.id })
                if (data1) {
                    let role = interaction.options.getRole("role")
                    let tranchannel = interaction.options.getChannel("transcript")
                    const guild = interaction.guild.id
                    let channel = interaction.options.getChannel("channel")
                    let category = interaction.options.getChannel("category")
                    try {
                        if (interaction.options.getChannel("category").type !== ChannelType.GuildCategory) return interaction.editReply(`${category} is not a Category.`)
                    } catch (err) {
                        console.log("NO CATEGORY")
                    }
                    let name = interaction.options.getString("name")
                    const data = await ticketdata.findOne({ guildId: guild })
                    if (role) {
                        data.roles = role.id
                    }
                    if (tranchannel) {
                        data.transcriptchannel = tranchannel.id
                    }
                    if (category) {
                        data.category = category.id
                    }
                    if (!name) {
                        name = 'Support Ticket'
                    }
                    if (name) {
                        data.name = name
                    }
                    await data.save()
                    if (channel) {
                        const embed = new EmbedBuilder()
                            .setTitle(name)
                            .setDescription("To create a ticket react with 📩")
                            .setColor(interaction.client.user.hexAccentColor || 'Blurple')
                            .setFooter({ text: `Fuca - TicketTool`, iconURL: interaction.client.user.avatarURL({ dynamic: true }) })
                        const btn = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId("ticket").setLabel("Create Ticket").setStyle(ButtonStyle.Primary).setEmoji('📩')
                        ])
                        await channel.send({ embeds: [embed], components: [btn] })
                    }


                    await interaction.editReply(`Data updated.`)
                } else if (!data1) {
                    let role = interaction.options.getRole("role")
                    let tranchannel = interaction.options.getChannel("transcript")
                    const guild = interaction.guild.id
                    let channel = interaction.options.getChannel("channel")
                    let category = interaction.options.getChannel("category")
                    try {
                        if (interaction.options.getChannel("category").type !== "GUILD_CATEGORY") return interaction.editReply(`<#${category}> is not a Category.`)
                    } catch (err) {
                        console.log("NO CATEGORY")
                    }
                    let name = interaction.options.getString("name")
                    await ticketdata.create({
                        guildId: guild
                    })
                    const data = await ticketdata.findOne({ guildId: guild })
                    if (role) {
                        data.roles = role.id
                    }
                    if (tranchannel) {
                        data.transcriptchannel = tranchannel.id
                    }
                    if (category) {
                        data.category = category.id
                    }
                    if (!name) {
                        name = 'Support Ticket'
                    }
                    if (name) {
                        data.name = name
                    }
                    await data.save()
                    if (channel) {
                        const embed = new EmbedBuilder()
                            .setTitle(name)
                            .setDescription("To create a ticket react with 📩")
                            .setColor(interaction.client.user.hexAccentColor || 'Blurple')
                            .setFooter({ text: `Fuca - TicketTool`, iconURL: interaction.client.user.avatarURL({ dynamic: true }) })
                        const btn = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId("ticket").setLabel("Create Ticket").setStyle(ButtonStyle.Primary).setEmoji('📩')
                        ])
                        await channel.send({ embeds: [embed], components: [btn] })
                    }


                    await interaction.editReply(`Setup completed.`)
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
                .setDescription(`ERROR IN TICKET COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}