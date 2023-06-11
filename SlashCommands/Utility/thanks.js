const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const db = require('quick.db')
const ms = require('ms')

module.exports = {
    name: 'thanks',
    description: 'Thank a user.',
    options: [
        {
            name: 'user',
            description: 'Mention user.',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {*} color
     */
    run: async (client, interaction, args, color) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            const timeout = 43200000; //12 hours
            let bump = await db.fetch(`cooldown_${interaction.member.user.id}`)
            if (bump !== null && timeout - (Date.now() - bump) > 0) {
                let time = ms(timeout - (date.now() - bump), { long: true })
                return await interaction.editReply(`**Your are on cooldown**\nTime left: \`${time}\` remaining`)
            }
            let user = interaction.options.getUser("user")
            if (!user) return await interaction.editReply(`Please provide a user to thanks them`)
            if (user.id === interaction.member.user.id) return await interaction.editReply(`You can't thanks yourself`)

            db.add(`userthanks_${user.id}`, 1)
            db.set(`cooldown_${interaction.member.user.id}`, Date.now())
            return await interaction.editReply(`<@${user.id}>, You got a thanks from <@${interaction.member.user.id}>`)
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN THANKS (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}