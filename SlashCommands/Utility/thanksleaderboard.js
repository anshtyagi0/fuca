const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const db = require('quick.db')
const ms = require('ms')

module.exports = {
    name: 'thxleaderboard',
    description: 'Shows servers top 10 users of thanks',
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
             
            let thanks = db.all().filter(data => data.ID.startsWith(`userthanks_`)).sort((a, b) => b.data - a.data);

            //This will check weather there is data in thanks leaderboard otherwise the client will send this
            if (!thanks.length) {
                let noEmbed = new EmbedBuilder()
                    .setTitle(interaction.member.displayName, interaction.member.displayAvatarURL())
                    .setColor('Green')
                    .setFooter("Nothing to see here yet")
                return await interaction.editReply({ embeds: [embed] })
            };

            //As you see this headace this is the interface of leaderboard where you will see top 10 users as i have mentioned thanks leaderboard length here, you can increase as per your wish

            thanks.length = 10;
            var finalLb = "";
            for (var i in thanks) {
                if (thanks[i].data === null) thanks[i].data = 0
                finalLb += `**${thanks.indexOf(thanks[i]) + 1}. ${client.users.cache.get(thanks[i].ID.split('_')[1]) ? client.users.cache.get(thanks[i].ID.split('_')[1]).tag : "Unknown User#0000"}** - \`${thanks[i].data} Thanks\`\n`;
            };

            const embed = new EmbedBuilder()
                .setTitle(`Thanks Leaderboard of ${interaction.guild.name}`)
                .setColor("Green")
                .setDescription(finalLb)
            await interaction.editReply({ embeds: [embed] })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN THANKSLEADERBOARD (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}