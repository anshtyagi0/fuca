const db = require("../../Detabase/suggestion.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');


module.exports = {
    name: 'poll',
    description: 'Poll system.',
    options: [
        {
            name: 'create',
            description: 'Create new poll. Max 5 options',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'question',
                    description: 'Enter question or topic for poll.',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: '1',
                    description: 'Option 1',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: '2',
                    description: 'Option 2',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: '3',
                    description: 'Option 3',
                    required: false,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: '4',
                    description: 'Option 4',
                    required: false,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: '5',
                    description: 'Option 5',
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: true
        });
        try {
            const command = interaction.options.getSubcommand(true)
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                if (command === 'create') {
                    let title = await interaction.options.getString('question')
                    let option1 = await interaction.options.getString('1')
                    let option2 = await interaction.options.getString('2')
                    let option3 = await interaction.options.getString('3')
                    let option4 = await interaction.options.getString('4')
                    let option5 = await interaction.options.getString('5')
                    a = 2
                    if (option3) a += 1
                    if (option4) a += 1
                    if (option5) a += 1
                    if (a == 2) {
                        let btn = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('option1').setLabel(`${option1}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option2').setLabel(`${option2}`).setStyle(ButtonStyle.Primary)
                        ])
                        let btn2 = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                        ])
                        let embed = new EmbedBuilder()
                            .setDescription(`**${option1}** ==========> **${0}**\n**${option2}** ==========> **${0}**`)
                        let msg = await interaction.channel.send({ content: `${title}\n\n You can pick any **one** option.\n Number of participants: 0`, embeds: [embed], components: [btn, btn2] })
                        const opt1 = {
                            name: option1,
                            total: 0,
                        }
                        const opt2 = {
                            name: option2,
                            total: 0,
                        }
                        await db.create({
                            guildId: interaction.guild.id,
                            messageId: msg.id,
                            channelId: interaction.channel.id,
                            options1: opt1,
                            options1list: [],
                            options2: opt2,
                            options2list: [],
                            title: title,
                            active: true,
                            total: 0,
                            option: 2
                        })
                    } else if (a == 3) {
                        let btn = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('option1').setLabel(`${option1}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option2').setLabel(`${option2}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option3').setLabel(`${option3}`).setStyle(ButtonStyle.Primary)
                        ])
                        let btn2 = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                        ])
                        let embed = new EmbedBuilder()
                            .setDescription(`**${option1}** ==========> **${0}**\n**${option2}** ==========> **${0}**\n**${option3}** ==========> **${0}**`)
                        let msg = await interaction.channel.send({ content: `${title}\n You can pick any **one** option.\n Number of participants: 0`, embeds: [embed], components: [btn, btn2] })
                        const opt1 = {
                            name: option1,
                            total: 0,
                        }
                        const opt2 = {
                            name: option2,
                            total: 0,
                        }
                        const opt3 = {
                            name: option3,
                            total: 0,
                        }
                        await db.create({
                            guildId: interaction.guild.id,
                            messageId: msg.id,
                            channelId: interaction.channel.id,
                            options1: opt1,
                            options1list: [],
                            options2: opt2,
                            options2list: [],
                            options3: opt3,
                            options3list: [],
                            title: title,
                            total: 0,
                            active: true,
                            option: 3
                        })
                    } else if (a == 4) {
                        let btn = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('option1').setLabel(`${option1}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option2').setLabel(`${option2}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option3').setLabel(`${option3}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option4').setLabel(`${option4}`).setStyle(ButtonStyle.Primary)
                        ])
                        let btn2 = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                        ])
                        let embed = new EmbedBuilder()
                            .setDescription(`**${option1}** ==========> **${0}**\n**${option2}** ==========> **${0}**\n**${option3}** ==========> **${0}**\n**${option4}** ==========> **${0}**`)
                        let msg = await interaction.channel.send({ content: `${title}\n You can pick any **one** option.\n Number of participants: 0`, embeds: [embed], components: [btn, btn2] })
                        const opt1 = {
                            name: option1,
                            total: 0,
                        }
                        const opt2 = {
                            name: option2,
                            total: 0,
                        }
                        const opt3 = {
                            name: option3,
                            total: 0,
                        }
                        const opt4 = {
                            name: option4,
                            total: 0,
                        }
                        await db.create({
                            guildId: interaction.guild.id,
                            messageId: msg.id,
                            channelId: interaction.channel.id,
                            options1: opt1,
                            options1list: [],
                            options2: opt2,
                            options2list: [],
                            options3: opt3,
                            options3list: [],
                            options4: opt4,
                            options4list: [],
                            title: title,
                            total: 0,
                            active: true,
                            option: 4
                        })
                    } else if (a == 5) {
                        let btn = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('option1').setLabel(`${option1}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option2').setLabel(`${option2}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option3').setLabel(`${option3}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option4').setLabel(`${option4}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('option5').setLabel(`${option5}`).setStyle(ButtonStyle.Primary)
                        ])
                        let btn2 = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId('closepoll').setLabel(`🔒 Close Poll`).setStyle(ButtonStyle.Danger),
                        ])

                        let embed = new EmbedBuilder()
                            .setDescription(`**${option1}** ==========> **${0}**\n**${option2}** ==========> **${0}**\n**${option3}** ==========> **${0}**\n**${option4}** ==========> **${0}**\n**${option5}** ==========> **${0}**`)
                        let msg = await interaction.channel.send({ content: `${title}\n\n You can pick any **one** option.\n Number of participants: 0`, embeds: [embed], components: [btn, btn2] })
                        const opt1 = {
                            name: option1,
                            total: 0,
                        }
                        const opt2 = {
                            name: option2,
                            total: 0,
                        }
                        const opt3 = {
                            name: option3,
                            total: 0,
                        }
                        const opt4 = {
                            name: option4,
                            total: 0,
                        }
                        const opt5 = {
                            name: option5,
                            total: 0,
                        }

                        await db.create({
                            guildId: interaction.guild.id,
                            messageId: msg.id,
                            channelId: interaction.channel.id,
                            options1: opt1,
                            options1list: [],
                            options2: opt2,
                            options2list: [],
                            options3: opt3,
                            options3list: [],
                            options4: opt4,
                            options4list: [],
                            options5: opt5,
                            options5list: [],
                            title: title,
                            total: 0,
                            active: true,
                            option: 5
                        })
                    }
                    return await interaction.editReply({ content: `Done!`, ephemeral: true })
                }
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN THANKS (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply({ content: `Something went wrong! Here is error: ${err}`, ephemeral: true })
        }
    }
}