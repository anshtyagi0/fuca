const dayjs = require('dayjs');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const ms = require('ms')
const tododata = require("../../Detabase/todolist.js")
module.exports = {
    name: 'todo-add',
    description: 'Will add task to your todolist.',
    options: [
        {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            description: 'Name of the task',
            required: true
        }, {
            name: 'description',
            type: ApplicationCommandOptionType.String,
            description: 'Description of the task',
            required: true
        },
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
             
            let name = interaction.options.getString("name")
            let description = interaction.options.getString("description")
            const data = await tododata.findOne({ userID: interaction.member.user.id })
            if (data) {
                const old = data.list.find((x) => x.name === name)
                if (old) return await interaction.editReply('Task already their in todolist.')
                const count = (parseInt(data.tasks) + 1).toString()
                const newtask = {
                    name: name,
                    description: description
                }
                data.list = [...data.list, newtask]
                data.tasks = count
                await data.save()
                return await interaction.editReply({ content: `Task added to todolist. Total Tasks: ${count}`, ephemeral: false })
            } else if (!data) {
                await tododata.create({
                    userID: interaction.member.user.id,
                    tasks: '1'
                })
                const data2 = await tododata.findOne({ userID: interaction.member.user.id })
                const newtask = {
                    name: name,
                    description: description
                }
                data2.list = [newtask]
                await data2.save()
                return await interaction.editReply({ content: `Task added to todolist. Total Tasks: 1`, ephemeral: false })
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