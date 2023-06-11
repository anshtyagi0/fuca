const dayjs = require('dayjs');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const ms = require('ms')
const giveawaydata = require("../../Detabase/giveaway.js")
module.exports = {
    name: 'giveaway-start',
    description: 'Will start a giveaway.',
    options: [
        {
            name: 'winners',
            type: ApplicationCommandOptionType.String,
            description: 'How many winners should be their?',
            required: true
        }, {
            name: 'duration',
            type: ApplicationCommandOptionType.String,
            description: 'When should giveaway end? 1h, 1d max - 5d',
            required: true
        }, {
            name: 'title',
            type: ApplicationCommandOptionType.String,
            description: 'Giveaway title',
            required: true
        }, {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel you want giveaway to start'
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
                let channel;
                try {
                    channel = interaction.options.getChannel("channel").id
                } catch (err) {
                    channel = interaction.channelId
                }
                let winners = interaction.options.getString("winners")
                let duration = interaction.options.getString("duration")
                let date = new Date(Date.now() + ms(duration))
                const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                let title = interaction.options.getString("title")
                let msgbutton = new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setCustomId("ENTER-GIVEAWAY").setLabel("🎉 ENTER").setStyle(ButtonStyle.Success)
                ])
                let embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription("Click button 🎉 below to enter!")
                    .addFields(
                        { name: 'HOST', value: `<@${interaction.member.user.id}>` },
                        { name: 'Ends in', value: `<t:${dayjs(formattedDate).valueOf() / 1000}>` },
                        { name: 'Winners', value: winners },
                        { name: 'Users', value: '0' }
                    )
                let sendc = interaction.guild.channels.cache.get(channel)
                const msg = await sendc.send({ content: '🎉 GIVEAWAY 🎉', embeds: [embed], components: [msgbutton] })
                await giveawaydata.create({
                    channelID: channel,
                    guildID: interaction.guildId,
                    messageID: msg.id,
                    title: title,
                    winners: winners,
                    active: true,
                    host: interaction.member.user.id,
                    endat: (dayjs(formattedDate).valueOf() / 1000)
                })
                await interaction.editReply(`Giveaway started in <#${channel}>`)
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
                .setDescription(`ERROR IN GSTART (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
        }
    }
}