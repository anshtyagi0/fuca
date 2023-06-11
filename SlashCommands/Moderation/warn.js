const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const warnSchema = require('../../Detabase/warn.js')

module.exports = {
    name: 'warn',
    description: 'Will warn a member.',
    options: [
        {
            name: 'user',
            description: 'Mention user.',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'reason',
            description: 'Reason to warn member',
            required: true,
            type: ApplicationCommandOptionType.String
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
             
            const user = interaction.options.getUser("user");
            const member = interaction.guild.members.cache.get(user.id);
            if (interaction.member.permissions.has('ManageMessages') || interaction.member.permissions.has("Administrator")) {
                const notembed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setColor("Red")
                    .setDescription("You have to provide a user to warn or provide a valid user.")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const selfembed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("You cannot warn yourself.")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                if (!member) return await interaction.editReply({
                    content: "**OOPS**",
                    embeds: [notembed]
                })
                if (member === interaction.member) return await interaction.editReply({
                    content: "**OOPS**",
                    embeds: [selfembed]
                })
                let reason = interaction.options.getString('reason')
                const warnu = new EmbedBuilder()
                    .setTitle("Warn")
                    .setColor("Green")
                    .setDescription(`You have got a warning from ${interaction.guild.name} as requested by ${interaction.member.user.tag}`)
                    .addFields({ name: `Reason: `, value: `${reason}` })
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const warn = new EmbedBuilder()
                    .setTitle("Warn")
                    .setColor("Green")
                    .setDescription(`I have warned ${member} as requested by ${interaction.member.user.tag}`)
                    .addFields({ name: `Reason: `, value: `${reason}` })
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();

                new warnSchema({
                    userId: member.id,
                    guildId: interaction.guild.id,
                    moderatorId: interaction.member.user.id,
                    reason: reason,
                    timestamp: Date.now(),
                }).save();
                try {
                    await member.send({
                        content: 'Warning',
                        embeds: [warnu]
                    })
                    await interaction.editReply({
                        content: "Warned",
                        embeds: [warn],
                    })
                } catch (e) {
                    await interaction.editReply({
                        content: 'Warned',
                        embeds: [warn]
                    })
                    await interaction.followUp("Warned but unable to send message to user.")
                    console.log(e)
                }
            } else {
                return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." });
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN WARN (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}