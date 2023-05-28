const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Will give information about server.',
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
             
            function checkBots(guild) {
                let botCount = 0;
                guild.members.cache.forEach(member => {
                    if (member.user.bot) botCount++;
                });
                return botCount;
            }

            function checkMembers(guild) {
                let memberCount = 0;
                guild.members.cache.forEach(member => {
                    if (!member.user.bot) memberCount++;
                });
                return memberCount;
            }

            let btnraw = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("SERVERICON").setURL(interaction.guild.iconURL({ dynamic: true, size: 1024 })),
            ]);

            const serverembed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} - Informations`, interaction.guild.iconURL)
                .setColor("#15f153")
                .addFields(
                    { name: 'Server owner', value: `<@${interaction.guild.ownerId}>` },
                    { name: "Server Name", value: `${interaction.guild.name}` },
                    { name: 'Verification level', value: `${interaction.guild.verificationLevel}` },
                    { name: 'Total roles count', value: `${interaction.guild.roles.cache.size}` },
                    { name: 'Channel count', value: `${interaction.guild.channels.cache.size}` },
                    { name: 'Total member count', value: `${interaction.guild.memberCount}` },
                    { name: 'Humans', value: `${checkMembers(interaction.guild)}` },
                    { name: 'Bots', value: `${checkBots(interaction.guild)}` }
                )
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({ text: `Guild created at:` })
                .setTimestamp(interaction.guild.createdAt);
            await interaction.editReply({
                embeds: [serverembed],
                components: [btnraw]
            })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN SERVERINFO (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
