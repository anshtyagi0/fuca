const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'userinfo',
    description: 'Will give information about user.',
    options: [
        {
            name: 'user',
            description: 'Will give information about user.',
            type: ApplicationCommandOptionType.User,
            required: false
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
             
            const user = interaction.options.getUser("user") || interaction.member
            let member = interaction.guild.members.cache.get(user.id);

            // Trim roles
            let rolesname;
            let roles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, -1);

            rolesname = roles.join(" ")
            if (member.roles.cache.size < 1) rolesname = "No Roles"


            if (!member.roles.cache.size || member.roles.cache.size - 1 < 1) roles = `\`None\``
            const embed = new EmbedBuilder()

                .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `ID: ${member.user.id}` })
                .setTimestamp()
                .setColor(member.displayHexColor)
                .setDescription(`**User:** \`${member.user.username}\` | \`#${member.user.discriminator}\`\n**ID:** \`${member.user.id}\`\n**Joined Discord At:** \`${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\`\n**Joined Server on:** \`${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}\`\n**Roles [${roles.length || '0'}]: ** ${rolesname || `\`That user has no roles\``}`)
            let btnraw = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Profile").setURL(`https://discord.com/users/${member.user.id}/`),
                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Link").setURL(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            ])
            await interaction.editReply({
                embeds: [embed],
                components: [btnraw]
            });
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN USERINFO (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
