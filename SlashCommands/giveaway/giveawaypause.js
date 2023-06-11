const dayjs = require('dayjs');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const ms = require('ms')
const giveawaydata = require("../../Detabase/giveaway.js")
module.exports = {
    name: 'giveaway-pause',
    description: 'Will start a giveaway.',
    options: [
        {
            name: 'pause',
            description: 'Want to pause or unpause giveaway?',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'PAUSE', value: 'pause' },
                { name: 'RESUME', value: 'unpause' }
            ],
            required: true
        },
        {
            name: 'giveawayid',
            description: "Giveaway message id.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                const option = interaction.options.getString('pause')
                const id = interaction.options.getString("giveawayid")
                const data = await giveawaydata.findOne({ messageID: id })
                if (data) {
                    let channels = await client.channels.cache.get(data.channelID)
                    let msg = await channels.messages.fetch(id)
                    if (data.active === true) {
                        if (option === 'pause') {
                            if (data.pause === false) {
                                data.pause = true
                                await data.save()
                                const embed = new EmbedBuilder()
                                    .setTitle(data.title)
                                    .setDescription("Click button 🎉 below to enter!")
                                    .addFields(
                                        { name: 'HOST', value: `<@${data.host}>` },
                                        { name: 'Ends in', value: 'PAUSED' },
                                        { name: 'Winners', value: data.winners },
                                        { name: 'Users', value: data.users }
                                    )
                                msg.edit({ embeds: [embed] })
                                return await interaction.editReply({ content: "Giveaway paused" })
                            } else if (data.pause === true) {
                                return await interaction.editReply("Giveaway is already paused.")
                            }
                        } else if (option === 'unpause') {
                            if (data.pause === false) {
                                return await interaction.editReply("Giveaway is already resumed.")
                            } else if (data.pause === true) {
                                data.pause = false
                                await data.save()
                                const embed = new EmbedBuilder()
                                    .setTitle(data.title)
                                    .setDescription("Click button 🎉 below to enter!")
                                    .addFields(
                                        { name: 'HOST', value: `<@${data.host}>` },
                                        { name: 'Ends in', value: `<t:${data.endat}>` },
                                        { name: 'Winners', value: data.winners },
                                        { name: 'Users', value: data.users }
                                    )
                                msg.edit({ embeds: [embed] })
                                return await interaction.editReply({ content: "Giveaway resumed." })
                            }
                        }
                    } else if (data.active === false) {
                        return await interaction.editReply({ content: "Giveaway already ended." })
                    }
                } else if (!data) {
                    return await interaction.editReply({ content: 'Wrong giveaway message id.' })
                }
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN GPAUSE/UNPAUSE (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
        }
    }
}