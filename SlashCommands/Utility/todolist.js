const dayjs = require('dayjs');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const ms = require('ms')
const tododata = require("../../Detabase/todolist.js")
module.exports = {
    name: 'todo-list',
    description: 'Will show all tasks in your todolist.',

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
             
            const data = await tododata.findOne({ userID: interaction.member.user.id })
            if (data) {
                const description = async () => {
                    let description = ""
                    data.list.map(x => {
                        let name = x.name
                        let rrdescription = x.description || 'No description'
                        description = description + `\n**${name}**\n> ${rrdescription}`
                    });
                    return description
                }
                const d = await description()
                const embed = new EmbedBuilder()
                    .setTitle('Here is your todolist: ')
                    .setColor("Aqua")
                    .setDescription(d)
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                await interaction.editReply({ embeds: [embed] })
            } else if (!data) {
                return await interaction.editReply({ content: `You don't have any todolist.`, ephemeral: false })
            }

        } catch (err) {
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN TODOADD (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
        }
    }
}