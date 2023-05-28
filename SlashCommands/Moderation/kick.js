const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');


module.exports = {
    name: 'kick',
    description: 'Will kick the member.',
    options: [
        {
            name: 'user',
            description: 'Mention user.',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'reason',
            description: 'Reason to kick member',
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
            if (interaction.member.permissions.has('KickMembers') || interaction.member.permissions.has("Administrator")) {
                const notembed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("You have not mentioned a member to kick or provided a invalid member.")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const selfembed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("You cannot kick yourself.")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const roleembed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("You cannot kick someone having role equal or higher than you.")
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
                if (member.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.editReply({
                    content: "**OOPS**",
                    embeds: [roleembed]
                })
                let reason = interaction.options.getString('reason');
                if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
                const kicked = new EmbedBuilder()
                    .setTitle("KICKED")
                    .setColor("Green")
                    .setDescription(`I have successfully kicked ${member} as requested by ${interaction.member.user.tag}`)
                    .addFields({ name: "Reason", value: `${reason}` })
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();

                const kickedu = new EmbedBuilder()
                    .setTitle("KICKED")
                    .setColor("Green")
                    .setDescription(`You have been kicked from ${interaction.guild.name} as requested by ${interaction.member.user.tag}`)
                    .addFields({ name: "Reason", value: `${reason}` })
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();

                try {
                    await member.kick(reason)
                    await interaction.editReply({
                        content: "KICKED SUCCESSFULLY",
                        embeds: [kicked],
                    })
                    try {
                        await member.send({ embeds: [kickedu] });
                    } catch (err) {
                        await interaction.followUp("Member kicked successfully but cannot dm him/her.")
                    }
                } catch (err) {
                    await interaction.editReply({ content: `Something went wrong:\n${err}`, components: [d_btnraw] })
                }
            } else {
                return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." })
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN KICK (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}