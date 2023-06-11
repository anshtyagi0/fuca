const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');


module.exports = {
    name: 'clear',
    description: 'Will delete messages from this channel.',
    options: [
        {
            name: 'amount',
            description: 'Amount of message to be deleted.',
            required: true,
            type: ApplicationCommandOptionType.Integer
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
                const amount = interaction.options.getInteger('amount')

                if (!amount) return await interaction.editReply({ content: "Please provide the amount to messages you want to purge/clear." })
                if (amount > 100) return await interaction.editReply({ content: "You can only clear messages between 2 to 100." })
                if (amount < 2) return await interaction.editReply({ content: "You can only clear messages between 2 to 100." })

                const doneembed = new EmbedBuilder()
                    .setTitle('SUCCESSFULLY')
                    .setColor("Aqua")
                    .setDescription(`I have successfully cleared ${amount} of messages.`)
                    .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                    .setTimestamp();

                interaction.channel.messages.fetch({ limit: amount }).then(messages => interaction.channel.bulkDelete(messages, true));
                await interaction.editReply({ embeds: [doneembed] })
                try {
                    setInterval(interaction.deleteReply(), 5000)
                } catch (err) {
                    console.log("CLEAR ALREADY DELETED")
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
                .setDescription(`ERROR IN CLEAR (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
