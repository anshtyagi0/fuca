const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');

module.exports = {
    name: 'setup',
    description: 'Will setup server for using this bot.',

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
                s = interaction.guild.roles.cache.size
                size = s / 2
                try {
                    let muterole = await interaction.guild.roles.create({
                        name: "Fuca-Muted",
                        color: "BLACK",
                        reason: 'This is a muted role which will be used by Fuca.',
                        Permissions: ['ViewChannel', 'CREATE_INSTANT_INVITE', 'READ_MESSAGE_HISTORY'],
                        position: size
                    })
                    interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                        channel.permissionOverwrites.create(muterole, {
                            SendMessages: false
                        })
                    })
                } catch (err) {
                    let muterole = await interaction.guild.roles.create({
                        name: "Fuca-Muted",
                        color: "BLACK",
                        reason: 'This is a muted role which will be used by Fuca.',
                        Permissions: ['ViewChannel', 'CREATE_INSTANT_INVITE', 'READ_MESSAGE_HISTORY'],
                    })
                    interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                        channel.permissionOverwrites.create(muterole, {
                            SendMessages: false
                        })
                    })
                }
                await interaction.editReply("Mute role created successfully!")
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            await interaction.editReply(`Something went wrong: ${err}`)
        }
    }
}

function banned() {
    
}