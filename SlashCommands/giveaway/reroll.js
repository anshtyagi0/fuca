const dayjs = require('dayjs');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');
const ms = require('ms')
const giveawaydata = require("../../Detabase/giveaway.js")
module.exports = {
    name: 'giveaway-reroll',
    description: 'Reroll giveaway and get new winners.',
    options: [
        {
            name: 'giveawayid',
            description: "Giveaway message id.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                const id = interaction.options.getString("giveawayid")
                const data = await giveawaydata.findOne({ messageID: id })
                if (data) {
                    if (data.active === false) {
                        let channels = await client.channels.cache.get(data.channelID)
                        let msg = await channels.messages.fetch(id)
                        const winners = data.userlist.sort(() => Math.random() - 0.5).slice(0, data.winners);
                        let list = winners.map(entry => entry.id).join(', ').split(', ');
                        let mentions;
                        if (data.winner == '1') {
                            mentions = `<@${list}>`
                        } else {
                            mentions = list.map(id => `<@${id}>`).join(', ');
                        }
                        data.winner = mentions
                        await data.save();
                        await msg.reply({ content: `Congratulations ${mentions}, you won ${data.title}` })
                        const embed = new EmbedBuilder()
                            .setTitle(data.title)
                            .setDescription("Giveaway Ended!")
                            .addFields(
                                { name: 'HOST', value: `<@${data.host}>` },
                                { name: 'Ends in', value: `Ended` },
                                { name: 'Winner', value: data.winner },
                                { name: 'Users', value: data.users }
                            )
                        let msgbutton = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId("ENTER-GIVEAWAY").setLabel("🎉 ENTER").setStyle(ButtonStyle.Success).setDisabled(true)
                        ])
                        await interaction.editReply({ content: "Giveaway rerolled", ephemeral: false })
                        return msg.edit({
                            embeds: [embed],
                        })
                    } else if (data.active === true) {
                        await interaction.editReply({ content: "Giveaway not yet ended.", ephemeral: false })
                    }
                } else if (!data) {
                    return await interaction.editReply({ content: 'Wrong giveaway message id.' })
                }
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN GREROLL (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
        }
    }
}