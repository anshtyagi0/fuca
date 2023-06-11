const configs = require("../../Detabase/guildConfig.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType, AutoModerationRule, AutoModerationRuleKeywordPresetType } = require('discord.js');

module.exports = {

    name: "antiword",
    description: "Enable/Diable Antiword",
    options: [
        {
            name: "enable_disable",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Enable/Disable AntiWord system",
            options: [
                {
                    name: 'enable_disable',
                    type: ApplicationCommandOptionType.String,
                    description: "Enable/Disable AntiWord system",
                    choices: [
                        { name: 'ENABLE', value: 'enable' },
                        { name: 'DISABLE', value: 'disable' }
                    ],
                    required: true,
                }
            ],
        },
        {
            name: "add_words",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Add words to be blocked seperated by , like: Cat, dog",
            options: [
                {
                    name: 'words',
                    type: ApplicationCommandOptionType.String,
                    description: "Add words to be blocked seperated by , like: Cat, dog",
                    required: true,
                }
            ],
        },
        {
            name: "remove_words",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Remove words from antiword.",
            options: [
                {
                    name: 'words',
                    type: ApplicationCommandOptionType.String,
                    description: "Remove words from antiword seperated by , like: Cat, dog",
                    required: true,
                }
            ],
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

            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                const data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id })
                const option = interaction.options.getSubcommand(true).toLowerCase()
                if (option == 'enable_disable') {
                    const enable = interaction.options.getString("enable_disable")
                    if (enable === 'enable') {
                        if (data.antiword) return interaction.editReply("Already enabled.")
                        data.antiword = true
                        await data.save();
                        interaction.editReply({ content: "antiword is now enabled" });
                    } else if (enable === 'disable') {
                        if (!data.antiword) return interaction.editReply("Already disabled.")
                        data.antiword = false
                        await data.save();
                        interaction.editReply({ content: "antiword is now disabled" });
                    }
                } else if (option == 'add_words') {
                    let words = interaction.options.getString('words').split(',');
                    const newList = [];
                    for (const word of words) {
                        newList.push(word.replace(/\s/g, ''));
                    }

                    for (let i = 0; i < newList.length; i++) {
                        let ds = data.words.find((x) => x.word === newList[i].toLowerCase())
                        if (ds) {
                            console.log('Already in wordlist.')
                        } else if (!ds) {
                            const newword = {
                                word: newList[i].toLowerCase()
                            }
                            data.words = [...data.words, newword]
                            await data.save()
                        }

                    }
                    interaction.editReply({ content: 'Words added!' })

                } else if (option == 'remove_words') {
                    let words = interaction.options.getString('words').split(',');
                    const newList = [];
                    for (const word of words) {
                        newList.push(word.replace(/\s/g, ''));
                    }
                    for (let i = 0; i < newList.length; i++) {
                        let ds = data.words.find((x) => x.word === newList[i].toLowerCase())
                        if (ds) {
                            const filteredword = data.words.filter(x => x.word !== newList[i].toLowerCase())
                            data.words = filteredword
                            await data.save()
                        } else if (!ds) {
                            console.log("NO WORD>")
                        }
                    }

                    interaction.editReply({ content: 'Words removed!' })
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
                .setDescription(`ERROR IN XP COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}
