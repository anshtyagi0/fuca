const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');


module.exports = {
    name: 'unban',
    description: 'Will unban a member.',
    options: [
        {
            name: 'userid',
            description: 'Enter userid',
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
             
            if (interaction.member.permissions.has('BanMembers') || interaction.member.permissions.has("Administrator")) {
                const id = interaction.options.getString('userid');
                const bannedUsers = await interaction.guild.bans.fetch(id);
                const user = bannedUsers.user
                const unableembed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setColor("Red")
                    .setDescription("Unable to find user, please check the provided ID valid.")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                if (!user) return (await interaction.editReply({
                    content: "**OOPS**",
                    embeds: [unableembed]
                }))
                let reason;
                if (!reason) reason = '`None`';
                if (!reason.length > 1024) reason = reason.slice(0, 1021) + '...';

                await interaction.guild.members.unban(user, reason)
                const embed = new EmbedBuilder()
                    .setTitle('Unban Member')
                    .setDescription(`${user.tag} was successfully unbanned.`)
                    .addFields({ name: 'Reason', value: `${reason}` })
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp()
                    .setColor('Green');
                await interaction.editReply({
                    content: "**SUCCESS**",
                    embeds: [embed]
                })
            } else {
                return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." })
            }

        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN UNBAN (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
