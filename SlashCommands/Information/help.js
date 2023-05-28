const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, StringSelectMenuBuilder, Events } = require('discord.js');
const { i } = require("mathjs");

module.exports = {
    name: "help",
    description: "Help command which will list all commands of bot.",
    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
          
        await interaction.editReply({ content: "Loading..." }).then(async () => {
            let homeembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('My Help Menu')
                .setDescription('Here is a list of all my commands.')
                .setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
            let selectmenu = new ActionRowBuilder().addComponents([
                new StringSelectMenuBuilder()
                    .setCustomId("helpmenu")
                    .setMaxValues(1)
                    .addOptions(
                        {
                            label: 'Home',
                            emoji: '🏠',
                            description: 'Home Page',
                            value: 'HOME'
                        },
                        {
                            label: 'AutoMod',
                            emoji: '🛠️',
                            description: 'AutoModeration Commands',
                            value: 'AUTOMOD'
                        },
                        {
                            label: 'Information',
                            emoji: 'ℹ️',
                            description: 'Information Commands',
                            value: 'INFORMATION'
                        },
                        {
                            label: 'Moderation',
                            emoji: '🛠️',
                            description: 'Moderation Commands',
                            value: 'MODERATION'
                        },
                        {
                            label: 'Utility',
                            emoji: '📇',
                            description: 'Utility Commands',
                            value: 'UTILITY'
                        },
                        {
                            label: 'Config',
                            emoji: '⚙️',
                            description: 'Config Commands',
                            value: 'CONFIG'
                        },
                        {
                            label: 'Leveling',
                            emoji: '🥇',
                            description: 'Leveling Commands',
                            value: 'LEVEL'
                        },
                        {
                            label: 'Search',
                            emoji: '🔍',
                            description: 'Search Commands',
                            value: 'SEARCH'
                        },
                        {
                            label: 'Reaction Roles',
                            emoji: '👍',
                            description: 'Reaction Commands',
                            value: 'RROLE'
                        },
                        {
                            label: 'Giveaway',
                            emoji: '🎁',
                            description: 'Giveaway Commands',
                            value: 'GIVEAWAY'
                        },
                        {
                            label: 'Ticket Tool',
                            emoji: '🎫',
                            description: 'Ticket Commands',
                            value: 'TicketTool'
                        },
                        {
                            label: 'Owner Only',
                            emoji: '🤑',
                            description: 'Owner Only Commands',
                            value: 'OWNER'
                        }
                    )
            ])

            let d_selectmenu = new ActionRowBuilder().addComponents([
                new StringSelectMenuBuilder()
                    .setCustomId("helpmenu")
                    .setMaxValues(1)
                    .setDisabled(true)
                    .addOptions(
                        {
                            label: 'Home',
                            emoji: '🏠',
                            description: 'Home Page',
                            value: 'HOME'
                        },
                        {
                            label: 'AutoMod',
                            emoji: '🛠️',
                            description: 'AutoModeration Commands',
                            value: 'AUTOMOD'
                        },
                        {
                            label: 'Information',
                            emoji: 'ℹ️',
                            description: 'Information Commands',
                            value: 'INFORMATION'
                        },
                        {
                            label: 'Moderation',
                            emoji: '🛠️',
                            description: 'Moderation Commands',
                            value: 'MODERATION'
                        },
                        {
                            label: 'Utility',
                            emoji: '📇',
                            description: 'Utility Commands',
                            value: 'UTILITY'
                        },
                        {
                            label: 'Config',
                            emoji: '⚙️',
                            description: 'Config Commands',
                            value: 'CONFIG'
                        },
                        {
                            label: 'Leveling',
                            emoji: '🥇',
                            description: 'Leveling Commands',
                            value: 'LEVEL'
                        },
                        {
                            label: 'Search',
                            emoji: '🔍',
                            description: 'Search Commands',
                            value: 'SEARCH'
                        },
                        {
                            label: 'Reaction Roles',
                            emoji: '👍',
                            description: 'Reaction Commands',
                            value: 'RROLE'
                        },
                        {
                            label: 'Giveaway',
                            emoji: '🎁',
                            description: 'Giveaway Commands',
                            value: 'GIVEAWAY'
                        },
                        {
                            label: 'Ticket Tool',
                            emoji: '🎫',
                            description: 'Ticket Commands',
                            value: 'TicketTool'
                        },
                        {
                            label: 'Owner Only',
                            emoji: '🤑',
                            description: 'Owner Only Commands',
                            value: 'OWNER'
                        }
                    )
            ])

            let infoembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("INFORMATION COMMANDS")
                .setDescription(`>>> </help:1085259084841893995>, </invite:1085259084841893996>, </ping:1085259084841893997>, </botinfo:1085259084841893994>, </report:1085259084841893998>, </shard:1085259085143879781>, </support:1085259085143879782>, </update:1085259085143879783>`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let levlembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("LEVEL COMMANDS")
                .setDescription(`>>> </rank:1085259085143879784>`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let searchembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("SEARCH COMMANDS")
                .setDescription(`>>> </anime:1085259085487808630>, </urban:1085259085487808631>`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let giveawayembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("GIVEAWAY COMMANDS")
                .setDescription(`>>> </giveaway-start:1085259086976778362>, </giveaway-reroll:1085259086976778363>, </giveaway-end:1085259086507028547>, </giveaway-pause:1085259086507028549>`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let ticketembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("TICKET COMMANDS")
                .setDescription(`>>> </ticket:1085259085877887108>, </panel-ticket:1085259085877887107>, </adduser:1087427468136300666>, </removeuser:1087427468136300667>`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let automodembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("AUTOMOD COMMANDS")
                .addFields(
                    { name: 'Anti-Link', value: '>>> </antilink enable_disable:1089238221784879275>, </antilink ignore-channel-add:1089238221784879275>, </antilink ignore-channel-remove:1089238221784879275>'},
                    { name: 'Anti-Word', value: '>>> </antiword enable_disable:1109163771466879026>, </antiword add_words:1109163771466879026>, </antiword remove_words:1109163771466879026>'}
                )
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let rrembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("REACTION ROLE COMMAND")
                .setDescription(`>>> </add-role:1085259086976778364>, </delete-role:1085259086976778365>, </panel:1085259086976778366>`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let modembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("MODERATION COMMANDS")
                .setDescription(`>>> </ban:1085259085143879785>, </kick:1085259085143879789>, </clear:1085259085143879786>, </warn:1085259085487808628>, </clearwarn:1085259085143879787>, </warnings:1085259085487808629>, </giverole:1085259085143879788>, </mute:1085259085143879790>, </removerole:1085259085487808622>, </roleinfo:1085259085487808623>, </serverinfo:1085259085487808624>, </unban:1085259085487808625>, </unmute:1085259085487808626>, </userinfo:1085259085487808627>, `)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let utilityembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("UTILITY COMMANDS")
                .setDescription(`>>> </afk:1085259085877887109>, </avatar:1085259085877887110>, </calculator:1085259085877887111>, </createcustom:1085259085877887112>, </deletecustom:1085259085877887113>, </listcustom:1085259085877887114>, </thanks:1085259086507028541>, </mythanks:1085259085877887115>, </thxleaderboard:1085259086507028542>, </youtube:1085259086507028546>, </todo-add:1085259086507028543>, </todo-remove:1085259086507028545>, </todo-list:1085259086507028544>, </poll create:1111689072038137856>`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let configembed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle("CONFIG COMMANDS")
                .addFields(
                    { name: 'Leave commands', value: `>>> </leave disable:1085259084841893989>, </leave enable:1085259084841893989>, </leave background:1085259084841893989>, </leave channel:1085259084841893989>, </leave message:1085259084841893989>` },
                    { name: 'Setup', value: `>>> </setup:1085259084841893991>` },
                    { name: 'Welcome commands', value: `>>> </welcome disable:1085259084841893992>, </welcome enable:1085259084841893992>, </welcome background:1085259084841893992>, </welcome channel:1085259084841893992>, </welcome message:1085259084841893992>` },
                    { name: 'XP commands', value: `>>> </xp enable:1085259084841893993>, </xp custom-background-rank:1085259084841893993>, </xp disable:1085259084841893993>, </xp ignore-channel-add:1085259084841893993>, </xp ignore-channel-remove:1085259084841893993>, </xp level-up-channel:1085259084841893993>, </xp level-up-message:1085259084841893993>, </xp level-up-message-disable:1085259084841893993>, </xp level-up-message-enable:1085259084841893993>, </xp limits:1085259084841893993>, </xp rate:1085259084841893993>` },
                    { name: 'Logging commands', value: `>>> </log channel_enable_disable:1086351058739134494>, </log enable_disable:1086351058739134494>, </log member_enable_disable:1086351058739134494>, </log message_enable_disable:1086351058739134494>`},
                    { name: 'Verify commands', value: `>>> </verify enable:1109759242048634961>, </verify disable:1109759242048634961>`}
                )
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            let owner = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Owner command")
                .setDescription(`>>>${client.commands
                    .filter((cmd) => cmd.category === 'Owner')
                    .map((cmd) => `\`${cmd.name}\``)
                    .join(", ")}`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
            await interaction.editReply({
                content: "HELP EMBED",
                embeds: [homeembed],
                components: [selectmenu]
            }).then(async (msg) => {
                let filter = i => i.user.id === interaction.member.user.id;
                let collector = await msg.createMessageComponentCollector({ filter: filter, time: 5000 * 60 });
                collector.on('collect', async (btn) => {
                    if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "INFORMATION") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [infoembed] })
                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "HOME") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [homeembed] })
                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "CONFIG") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [configembed] })
                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "MODERATION") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [modembed] })
                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "UTILITY") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [utilityembed] })
                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "OWNER") {
                            if (!interaction.member.user.id === '671390595184459782') return await msg.reply("You are not my owner.")
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [owner] })

                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "LEVEL") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [levlembed] })

                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "RROLE") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [rrembed] })

                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "SEARCH") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [searchembed] })

                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "GIVEAWAY") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [giveawayembed] })

                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "TicketTool") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [ticketembed] })

                        }
                    } if (btn.isStringSelectMenu()) {
                        if (btn.values[0] === "AUTOMOD") {
                            await btn.deferUpdate().catch((e => { }))
                            await interaction.editReply({ embeds: [automodembed] })
                        }
                    }

                })

                collector.on('end', () => {
                    interaction.editReply({ embeds: [homeembed], components: [d_selectmenu] })
                })
            })


        })
    }
};