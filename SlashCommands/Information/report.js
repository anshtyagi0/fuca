const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, StringSelectMenuBuilder, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const reports = require('../../Detabase/report.js')

module.exports = {
    name: 'report',
    description: 'well send a report to developers.',
    options: [
        {
            name: "report",
            description: 'What probelm you faced?',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'command',
            description: 'In which command you noticed the problem?',
            type: ApplicationCommandOptionType.String,
            required: true
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
             
            const data = await reports.findOne({ guild: interaction.guildId, user: interaction.member.user.id })
            if (data) return await interaction.editReply('You already have a active report. Please wait for it to be claimed by Developers.')
            const reson = interaction.options.getString('report')
            const cmd = interaction.options.getString('command')
            const appsChannel = interaction.client.channels.cache.get('973263114487337030');
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                .setTitle("New Report")
                .setDescription(`**What problem you faced?**\n${reson}`)
                .addFields(
                    { name: 'Command', value: cmd },
                    { name: 'Link to user', value: `https://discord.com/users/${interaction.member.user.id}` }
                )
                .setColor("Blue")
                .setTimestamp()
            appsChannel.send({ content: `<@671390595184459782>`, embeds: [embed] }).then(async (msg1) => {
                reports.create({
                    user: interaction.member.user.id,
                    guild: interaction.guildId,
                    report: reson,
                    cmd: cmd,
                    id: msg1.id
                })
                const components = [
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('CLAIM-report')
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    label: 'CLAIM REPORT',
                                    value: ('claim'),
                                    description: 'CLAIM THIS REPORT'
                                },
                                {
                                    label: 'DECLINE REPORT',
                                    value: ('decline'),
                                    description: 'DELCINE THIS REPORT'
                                }
                            ]),
                    )
                ];
                msg1.edit({
                    content: `<@671390595184459782>`,
                    embeds: [embed],
                    components
                })
            })
            await interaction.editReply("Report sent!")
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN REPORT (Slash) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}