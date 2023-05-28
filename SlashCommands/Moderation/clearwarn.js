const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const warnSchema = require('../../Detabase/warn.js')

module.exports = {
    name: 'clearwarn',
    description: 'Will clear warnings of user.',
    options: [
        {
            name: 'warnid',
            description: 'Enter warn Id. check warn id by /warnings @user',
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
             
            if (interaction.member.permissions.has('ManageMessages') || interaction.member.permissions.has("Administrator")) {
                const notembed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setColor("Red")
                    .setDescription("You have not provided a warn id or have provided a invalid id. (check warnid by c!warnings @user)")
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();
                const warnid = interaction.options.getString('warnid');
                if (!warnid) return await interaction.editReply({
                    content: "**OOPS**",
                    embeds: [notembed]
                })
                const data = await warnSchema.findById(warnid);
                const user = interaction.guild.members.cache.get(data.userId);
                if (!data) return await interaction.editReply({
                    content: "**OOPS**",
                    embeds: [notembed]
                })
                const deleteembed = new EmbedBuilder()
                    .setTitle("DELETED SUCCESSFULLY")
                    .setColor("Green")
                    .setDescription(`Successfully removed 1 of ${user}'s warning.`)
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();

                data.delete();
                await interaction.editReply({
                    content: `1 warning of ${user} removed.`,
                    embeds: [deleteembed],
                })
            } else {
                return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." });
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN CLEARWARN (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
