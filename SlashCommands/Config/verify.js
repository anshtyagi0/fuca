const configs = require("../../Detabase/guildConfig.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, Colors } = require('discord.js');

module.exports = {

    name: "verify",
    description: "Set verification system for you server.",
    options: [{
        name: "enable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Enable verification system",
        options: [{
            name: "enable",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'ENABLE', value: 'enable' },
            ],
            description: "Enable verification system"
        },
        {
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            required: true,
            description: "Channel to send captcha to member."
        },
        {
            name: "role",
            type: ApplicationCommandOptionType.Role,
            required: true,
            description: "Role to be give to member after verification."
        },
        {
            name: 'time',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: '1 hour', value: '1h' },
                { name: '2 hour', value: '2h' },
                { name: '3 hour', value: '3h' }
            ],
            description: "Set maximum time user can take to get verified."
        },
        {
            name: 'action',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Kick', value: 'kick' },
                { name: 'Ban', value: 'ban' },
            ],
            description: "Set action to be taken on unverified members."
        }]
    }, {
        name: "disable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Disable verification system",
        options: [{
            name: "disable",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'DISABLE', value: 'disable' },
            ],
            description: "Disable verification system"
        }],
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
            const command = interaction.options.getSubcommand(true)
            if (command === 'enable') {
                if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {
                    let channel;
                    if (command === 'enable') {
                        channel = interaction.options.getChannel("channel").id;
                        let embed = new EmbedBuilder()
                            .setTitle('🤖 Verification Required')
                            .setColor(Colors.Blurple)
                            .setDescription(`To gain access to **${interaction.guild.name}** you need to prove you are a human by completing a captcha. Click the button below to get started!`)
                            .setFooter({ text: `Protected by Fuca`, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                        let button = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId("verify").setLabel("🤖 VERIFY").setStyle(ButtonStyle.Primary)
                        ])
                        let sendc = interaction.guild.channels.cache.get(channel)
                        await sendc.send({ embeds: [embed], components: [button] })
                    }
                    const verifyenable = interaction.options.getString("enable")
                    const verifyenable2 = interaction.options.getString("disable")
                    const time = interaction.options.getString("time")
                    const action = interaction.options.getString("action")
                    const role = interaction.options.getRole("role").id;
                    const data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id })
                    if (command === 'enable') {
                        if (verifyenable === 'enable') {
                            data.verify = true
                            data.verifychannel = channel
                            data.verifyrole = role
                            data.verifytime = time
                            data.verifyaction = action
                            await data.save();
                            interaction.editReply({ content: "verification is now enabled" });
                        }
                    } else if (command === 'disable') {
                        if (verifyenable2 === 'disable') {
                            if (!data.verify) return interaction.editReply("Already disabled.")
                            data.verify = false
                            await data.save();
                            interaction.editReply({ content: "verification is now disabled" });
                        }
                    }

                } else {
                    return await interaction.editReply("You don't have permissions to use it.")
                }
            } else {
                return
            }

        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


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
