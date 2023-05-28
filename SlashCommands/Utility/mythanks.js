const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: 'mythanks',
    description: 'Total number of thanks user got.',
    options: [
        {
            name: 'user',
            description: 'Mention user.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
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
             
            let user = interaction.options.getUser("user") || interaction.member.user
            let thanks = await db.get(`userthanks_${user.id}`)
            let thanksl = await db.get(`userthanks_${user.id}`)

            //Levels
            if (thanks > 0) thanks = "Level 0"
            if (thanks > 5) thanks = "Level 1"
            if (thanks > 10) thanks = "Level 2"
            if (thanks > 15) thanks = "Level 3"
            if (thanks > 20) thanks = "Level 4"
            if (thanks === null) thanks = "No Thanks"
            //You can add more.....

            //Embeds
            let embed = new EmbedBuilder()
                .setAuthor({ name: user.username || user.user.username })
                .setThumbnail(user.displayAvatarURL() || user.user.displayAvatarURL())
                .addFields(
                    { name: `User Level`, value: `\`${thanks}\`` || `\`New\`` },
                    { name: `User Total Thanks`, value: `\`${thanksl}\`` || `\`0\`` }
                )
                .setThumbnail()
                .setColor("DarkGreen")
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            await interaction.editReply({ embeds: [embed] })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN MYTHANKS (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}