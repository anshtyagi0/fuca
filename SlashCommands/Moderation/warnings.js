const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const warnSchema = require('../../Detabase/warn.js')

module.exports = {
    name: 'warnings',
    description: 'Will show all warnings of user..',
    options: [
        {
            name: 'user',
            description: 'Mention user.',
            required: true,
            type: ApplicationCommandOptionType.User
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
             
            if (interaction.member.permissions.has('KickMembers') || interaction.member.permissions.has("Administrator")) {
                const user = interaction.options.getUser("user");
                const member = interaction.guild.members.cache.get(user.id);
                if (!member) return await interaction.editReply({ content: "Please mention a user to check warnings." })
                const memberWarnings = await warnSchema.find({ userId: user.id, guildId: interaction.guild.id });

                if (!memberWarnings?.length) return await interaction.editReply({ content: "NO warnings found." })
                const embedDescription = memberWarnings
                    .map((warn) => {
                        const moderator = interaction.guild.members.cache.get(
                            warn.moderatorId
                        );

                        return [
                            `warnId: ${warn._id}`,
                            `Moderator: ${moderator || 'Has left'}`,
                            `Reason: ${warn.reason}`,
                        ].join("\n");

                    }).join('\n\n');
                const embed = new EmbedBuilder()
                    .setTitle(`warnings`)
                    .setColor(`Random`)
                    .setDescription(embedDescription)
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();

                await interaction.editReply({
                    content: `${member}'s warnings`,
                    embeds: [embed]
                })
            } else {
                return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." })
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN WARNINGS (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}