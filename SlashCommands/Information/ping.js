const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: "ping",
    description: "🏓 pong",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        await interaction.editReply({ content: "Pinging..." }).then(async () => {
            const ping = ++client.ws.ping
            const api_ping = client.ws.ping
            let embed = new EmbedBuilder()
                .setAuthor({ name: `Pong`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setColor("Blurple")
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .addFields(
                    { name: "Bot Latency", value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\`` },
                    { name: "API Latency", value: `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\`` }
                )
                .setTimestamp()
            await interaction.editReply({
                content: `**${interaction.member.user.toString()} PINGED**`,
                embeds: [embed]
            });
        })
    }
}