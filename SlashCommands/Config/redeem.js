const usersdata = require("../../Detabase/term.js")
const premiumScheme = require("../../Detabase/premiumScheme.js");
const gift = require("../../Detabase/giftcode.js");
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'redeem',
    description: 'Will redeem gift code to get bot premium.',
    options: [{
        name: 'code',
        type: ApplicationCommandOptionType.String,
        required: true,
        description: 'Enter gift code.'
    }],

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
             
            let code = interaction.options.getString("code")
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                let data = await premiumScheme.findOne({ Guild: interaction.guild.id })
                let data2 = await gift.findOne({ code: code })
                if (!data2) return interaction.editReply("Invalid code.")
                if (data) {
                    return interaction.editReply("This server is already having premium.")
                } else {
                    new premiumScheme({
                        Guild: interaction.guild.id,
                        Expire: data2.Expire,
                        Permanent: false,
                    }).save();
                    await data2.delete();
                    await interaction.editReply("Premium Added!")
                }
            } else {
                return await interaction.editReply("You can only redeem this in your server.")
            }
        } catch (err) {
            await interaction.editReply(`Something went wrong: ${err}`)
        }
    }
}

function banned() {

}