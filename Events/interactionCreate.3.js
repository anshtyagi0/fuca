const config = require("../Detabase/guildConfig.js")
const suggestion = require("../Detabase/suggestion.js")
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, Client, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ApplicationCommandOptionType, ButtonStyle, PermissionsBitField, ChannelType, AttachmentBuilder } = require('discord.js');
module.exports = async (client, interaction) => {
    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {CommandInteraction} interaction
     */

    if (interaction.isButton()) {
        if (interaction.customId === 'option1') {
            let msgid = interaction.message.id
            let channel = interaction.channel.id
            let guild = interaction.guild.id
            let data = await suggestion.findOne({ guildId: guild, messageId: msgid })
            if (data.active == true) {
                let a = 0;
                let userlist = data.options1list
                let userlist2 = data.options2list
                let userlist3 = data.options3list
                let userlist4 = data.options4list
                let userlist5 = data.options5list
                if (userlist.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist2.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist3.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist4.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist5.includes(`${interaction.member.user.id}`)) a += 1
                if (a > 0) return interaction.reply({ content: 'You have already selected option.', ephemeral: true })
                await suggestion.findOneAndUpdate({ guildId: guild, messageId: msgid }, {
                    $push: {
                        'options1list': interaction.member.user.id
                    }
                })
                data.options1[0] = {
                    name: data.options1[0].name,
                    total: data.options1[0].total + 1
                }
                data.total = data.total + 1
                if (data.option == 2) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 3) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 4) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 5) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let percentage5 = data.options5[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option5').setLabel(`${data.options5[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**\n**${data.options5[0].name}** ==========> **${percentage5}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                }
                data.save()
                return interaction.reply({ content: `You have choosen **${data.options1[0].name}**.`, ephemeral: true })
            } else if (data.active == false) return

        } else if (interaction.customId === 'option2') {
            let msgid = interaction.message.id
            let channel = interaction.channel.id
            let guild = interaction.guild.id
            let data = await suggestion.findOne({ guildId: guild, messageId: msgid })
            if (data) {
                let a = 0;
                let userlist = data.options1list
                let userlist2 = data.options2list
                let userlist3 = data.options3list
                let userlist4 = data.options4list
                let userlist5 = data.options5list
                if (userlist.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist2.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist3.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist4.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist5.includes(`${interaction.member.user.id}`)) a += 1
                if (a > 0) return interaction.reply({ content: 'You have already selected option.', ephemeral: true })
                await suggestion.findOneAndUpdate({ guildId: guild, messageId: msgid }, {
                    $push: {
                        'options2list': interaction.member.user.id
                    }
                })
                data.options2[0] = {
                    name: data.options2[0].name,
                    total: data.options2[0].total + 1
                }
                data.total = data.total + 1
                if (data.option == 2) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 3) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 4) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 5) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let percentage5 = data.options5[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option5').setLabel(`${data.options5[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**\n**${data.options5[0].name}** ==========> **${percentage5}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                }
                data.save()
                return interaction.reply({ content: `You have choosen **${data.options2[0].name}**.`, ephemeral: true })
            } else if (data.active == false) return

        } else if (interaction.customId === 'option3') {
            let msgid = interaction.message.id
            let channel = interaction.channel.id
            let guild = interaction.guild.id
            let data = await suggestion.findOne({ guildId: guild, messageId: msgid })
            if (data) {
                let a = 0;
                let userlist = data.options1list
                let userlist2 = data.options2list
                let userlist3 = data.options3list
                let userlist4 = data.options4list
                let userlist5 = data.options5list
                if (userlist.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist2.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist3.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist4.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist5.includes(`${interaction.member.user.id}`)) a += 1
                if (a > 0) return interaction.reply({ content: 'You have already selected option.', ephemeral: true })
                await suggestion.findOneAndUpdate({ guildId: guild, messageId: msgid }, {
                    $push: {
                        'options3list': interaction.member.user.id
                    }
                })
                data.options3[0] = {
                    name: data.options3[0].name,
                    total: data.options3[0].total + 1
                }
                data.total = data.total + 1
                if (data.option == 3) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 4) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 5) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let percentage5 = data.options5[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option5').setLabel(`${data.options5[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**\n**${data.options5[0].name}** ==========> **${percentage5}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                }
                data.save()
                return interaction.reply({ content: `You have choosen **${data.options3[0].name}**.`, ephemeral: true })
            } else if (data.active == false) return
        } else if (interaction.customId === 'option4') {
            let msgid = interaction.message.id
            let channel = interaction.channel.id
            let guild = interaction.guild.id
            let data = await suggestion.findOne({ guildId: guild, messageId: msgid })
            if (data) {
                let a = 0;
                let userlist = data.options1list
                let userlist2 = data.options2list
                let userlist3 = data.options3list
                let userlist4 = data.options4list
                let userlist5 = data.options5list
                if (userlist.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist2.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist3.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist4.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist5.includes(`${interaction.member.user.id}`)) a += 1
                if (a > 0) return interaction.reply({ content: 'You have already selected option.', ephemeral: true })
                await suggestion.findOneAndUpdate({ guildId: guild, messageId: msgid }, {
                    $push: {
                        'options4list': interaction.member.user.id
                    }
                })
                data.options4[0] = {
                    name: data.options4[0].name,
                    total: data.options4[0].total + 1
                }
                data.total = data.total + 1
                if (data.option == 3) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 4) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 5) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let percentage5 = data.options5[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option5').setLabel(`${data.options5[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**\n**${data.options5[0].name}** ==========> **${percentage5}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                }
                data.save()
                return interaction.reply({ content: `You have choosen **${data.options4[0].name}**.`, ephemeral: true })
            } else if (data.active == false) return
        } else if (interaction.customId === 'option5') {
            let msgid = interaction.message.id
            let channel = interaction.channel.id
            let guild = interaction.guild.id
            let data = await suggestion.findOne({ guildId: guild, messageId: msgid })
            if (data) {
                let a = 0;
                let userlist = data.options1list
                let userlist2 = data.options2list
                let userlist3 = data.options3list
                let userlist4 = data.options4list
                let userlist5 = data.options5list
                if (userlist.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist2.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist3.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist4.includes(`${interaction.member.user.id}`)) a += 1
                if (userlist5.includes(`${interaction.member.user.id}`)) a += 1
                if (a > 0) return interaction.reply({ content: 'You have already selected option.', ephemeral: true })
                await suggestion.findOneAndUpdate({ guildId: guild, messageId: msgid }, {
                    $push: {
                        'options5list': interaction.member.user.id
                    }
                })
                data.options5[0] = {
                    name: data.options5[0].name,
                    total: data.options5[0].total + 1
                }
                data.total = data.total + 1
                if (data.option == 3) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 4) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                } else if (data.option == 5) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let percentage5 = data.options5[0].total || 0
                    let btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('option1').setLabel(`${data.options1[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option2').setLabel(`${data.options2[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option3').setLabel(`${data.options3[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option4').setLabel(`${data.options4[0].name}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('option5').setLabel(`${data.options5[0].name}`).setStyle(ButtonStyle.Primary)
                    ])
                    let btn2 = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                    ])
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**\n**${data.options5[0].name}** ==========> **${percentage5}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}`, embeds: [embed], components: [btn, btn2] })
                }
                data.save()
                return interaction.reply({ content: `You have choosen **${data.options5[0].name}**.`, ephemeral: true })
            } else if (data.active == false) return
        } else if (interaction.customId === 'closepoll') {
            let msgid = interaction.message.id
            let channel = interaction.channel.id
            let guild = interaction.guild.id
            let data = await suggestion.findOne({ guildId: guild, messageId: msgid })
            if (data.active == true) {
                if (data.option == 2) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0

                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}\nPoll closed <t:${Math.round(Date.now() / 1000)}> by <@${interaction.member.user.id}>`, embeds: [embed], components: [] })
                } else if (data.option == 3) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}\nPoll closed <t:${Math.round(Date.now() / 1000)}> by <@${interaction.member.user.id}>`, embeds: [embed], components: [] })
                } else if (data.option == 4) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}\nPoll closed <t:${Math.round(Date.now() / 1000)}> by <@${interaction.member.user.id}>`, embeds: [embed], components: [] })
                } else if (data.option == 5) {
                    let percentage = data.options1[0].total || 0
                    let percentage2 = data.options2[0].total || 0
                    let percentage3 = data.options3[0].total || 0
                    let percentage4 = data.options4[0].total || 0
                    let percentage5 = data.options5[0].total || 0
                    let embed = new EmbedBuilder()
                        .setDescription(`**${data.options1[0].name}** ==========> **${percentage}**\n**${data.options2[0].name}** ==========> **${percentage2}**\n**${data.options3[0].name}** ==========> **${percentage3}**\n**${data.options4[0].name}** ==========> **${percentage4}**\n**${data.options5[0].name}** ==========> **${percentage5}**`)
                    let msg = await interaction.guild.channels.cache.find(x => x.id === data.channelId).messages.fetch(data.messageId)
                    msg.edit({ content: `${data.title}\n\n You can pick any **one** option.\n Number of participants: ${data.total}\nPoll closed <t:${Math.round(Date.now() / 1000)}> by <@${interaction.member.user.id}>`, embeds: [embed], components: [] })
                }
                data.active = false
                data.save()
                return interaction.reply({ content: `Closed.`, ephemeral: true })
            } else if (data.active == false) return;
        }
    }
}