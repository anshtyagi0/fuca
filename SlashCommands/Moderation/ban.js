const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');


module.exports = {
    name: 'ban',
    description: 'Will ban the member.',
    options: [
        {
            name: 'user',
            description: 'Mention user.',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'reason',
            description: 'Reason to ban member',
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
            if (interaction.member.permissions.has('BanMembers') || interaction.member.permissions.has("Administrator")) {
                const notembed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("You have not mentioned a member to ban or provided a invalid member.")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const selfembed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("You cannot ban yourself.")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const roleembed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("You cannot ban someone having role equal or higher than you.")
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
                const banned = new EmbedBuilder()
                    .setTitle("BANNED")
                    .setColor("Green")
                    .setDescription(`I have successfully baned ${member} as requested by ${interaction.member.user.tag}`)
                    .addFields({ name: "Reason", value: `${reason}` })
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const bannedu = new EmbedBuilder()
                    .setTitle("BANNED")
                    .setColor("Green")
                    .setDescription(`You have been banned from ${interaction.guild.name} as requested by ${interaction.member.user.tag}`)
                    .addFields({ name: "Reason", value: `${reason}` })
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                try {
                    await member.ban({ reason })
                    await interaction.editReply({
                        content: "BANED SUCCESSFULLY",
                        embeds: [banned],
                    })
                    try {
                        await member.send({ embeds: [bannedu] })
                    } catch (err) {
                        interaction.followUp({ content: 'User banned but I was unable to dm user.' })
                    }
                } catch (err) {
                    await interaction.editReply({ content: `Something went wrong:\n${err}`, components: [d_btnraw] })
                }
            } else {
                return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." })
            }

        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN BAN (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
