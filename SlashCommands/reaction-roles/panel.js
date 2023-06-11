const rrModel = require('../../Detabase/reactionroles.js');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, StringSelectMenuBuilder, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'panel',
    description: 'Reaction role panel',
    options: [
        {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel you want panel message to be sent!'
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
             
            let channel;
            try {
                channel = interaction.options.getChannel("channel").id
            } catch (err) {
                channel = interaction.channelId
            }
            if (interaction.member.permissions.has("ManageRoles") || interaction.member.permissions.has("Administrator")) {
                const guildData = await rrModel.findOne({
                    guildId: interaction.guildId
                });
                if (!guildData) {
                    return await interaction.editReply("first add role to rr command")
                }
                if (!guildData?.roles) {
                    return interaction.followUp("There is no roles inside this server.")
                }

                const options = guildData.roles.map(x => {
                    const role = interaction.guild.roles.cache.get(x.roleId);
                    if (x.roleEmoji) {
                        return {
                            label: role.name,
                            value: role.id,
                            description: x.roleDescription || 'No description',
                            emoji: x.roleEmoji
                        }
                    } else if (!x.roleEmoji) {
                        return {
                            label: role.name,
                            value: role.id,
                            description: x.roleDescription || 'No description',
                        }
                    }
                });

                const description = async () => {
                    let description = ""
                    guildData.roles.map(x => {
                        const role = interaction.guild.roles.cache.get(x.roleId);
                        let label = role.name
                        let value = role.id
                        let rrdescription = x.roleDescription || 'No description'
                        let emoji = x.roleEmoji
                        if (emoji) {
                            description = description + `\n${emoji} **${label}**\n> ${rrdescription}`
                        } else if (!emoji) {
                            description = description + `\n**${label}**\n> ${rrdescription}`
                        }
                    });
                    return description
                }
                const d = await description()

                const panelEmbed = new EmbedBuilder()
                    .setTitle('Please select a role below')
                    .setColor("Aqua")
                    .setDescription(d)
                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('reaction-roles')
                                .setMaxValues(1)
                                .addOptions(options)
                        )
                ];
                let sendc = interaction.guild.channels.cache.get(channel)
                sendc.send({ embeds: [panelEmbed], components: components })
                await interaction.editReply({ content: "DONE", ephemeral: false })
            } else {
                return await interaction.followUp("You don't have permissions to use it.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN PANEL COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}