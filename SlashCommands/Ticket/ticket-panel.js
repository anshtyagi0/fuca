const ticketdata = require("../../Detabase/tickettool.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, StringSelectMenuBuilder, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');

module.exports = {
    name: 'panel-ticket',
    description: 'Ticket tool panel',
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
            const data = await ticketdata.findOne({ guildId: interaction.guildId })
            try {
                channel = interaction.options.getChannel("channel").id
            } catch (err) {
                channel = interaction.channelId
            }
            if (interaction.member.permissions.has("ManageRoles") || interaction.member.permissions.has("Administrator")) {
                const embed = new EmbedBuilder()
                    .setTitle(data.name)
                    .setDescription("To create a ticket react with 📩")
                    .setColor(interaction.client.user.hexAccentColor || 'Blurple')
                    .setFooter({ text: `Fuca - TicketTool`, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                const btn = new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setCustomId("ticket").setLabel("Create Ticket").setStyle(ButtonStyle.Primary).setEmoji('📩')
                ])
                let sendc = interaction.guild.channels.cache.get(channel)
                sendc.send({ embeds: [embed], components: [btn] })
                await interaction.editReply({ content: "DONE", ephemeral: false })
            } else {
                return await interaction.followUp("You don't have permissions to use it.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


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