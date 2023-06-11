const configs = require("../../Detabase/guildConfig.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {

    name: "antilink",
    description: "Enable/Diable AntiLink",
    options: [
        {
            name: "enable_disable",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Enable/Disable AntiLink system",
            options: [{
                name: 'enable_disable',
                type: ApplicationCommandOptionType.String,
                description: "Enable/Disable AntiLink system",
                choices: [
                    { name: 'ENABLE', value: 'enable' },
                    { name: 'DISABLE', value: 'disable' }
                ],
                required: true,
            }],
        },
        {
            name: "ignore-channel-add",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Add ignore link Channel",
            options: [{
                name: "channel",
                type: ApplicationCommandOptionType.Channel,
                description: "Mention the channel to disable antilink",
                required: true
            }]
        }, {
            name: "ignore-channel-remove",
            type: ApplicationCommandOptionType.Subcommand,
            description: "remove ignore link Channel",
            options: [{
                name: "channel",
                type: ApplicationCommandOptionType.Channel,
                description: "Mention the channel to re-enable antilink",
                required: true
            }]
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
             
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                const data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id })
                const option = interaction.options.getSubcommand(true).toLowerCase()
                if (option == 'enable_disable') {
                    const enable = interaction.options.getString("enable_disable")
                    if (enable === 'enable') {
                        if (data.antilink) return interaction.editReply("Already enabled.")
                        data.antilink = true
                        await data.save();
                        interaction.editReply({ content: "antilink is now enabled" });
                    } else if (enable === 'disable') {
                        if (!data.antilink) return interaction.editReply("Already disabled.")
                        data.antilink = false
                        await data.save();
                        interaction.editReply({ content: "antilink is now disabled" });
                    }
                } else if (option === "ignore-channel-add") {
                    const channel = interaction.options.getChannel("channel").id;
                    if (data.ignorelink.includes(channel))
                        return interaction.editReply({ content: "Yo nerd this channel is already disabled for antilink" });

                    interaction.editReply({ content: "Now the mentioned channel will not get antilink" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { $push: { ignorelink: channel } })
                } else if (option === "ignore-channel-remove") {
                    const channel = interaction.options.getChannel("channel").id;
                    if (!data.ignorelink.includes(channel))
                        return interaction.editReply({ content: "Yo nerd, this channel is not disabled for antilink" });

                    interaction.editReply({ content: "Now the mentioned channel will get antilink" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { $pull: { ignorelink: channel } })
                }
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }

        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN XP COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}
