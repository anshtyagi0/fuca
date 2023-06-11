const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, Colors, ChannelType } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Will mute a member.',
    options: [
        {
            name: 'user',
            description: 'Mention user you want to mute.',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'reason',
            description: 'Reason to mute user.',
            required: true,
            type: ApplicationCommandOptionType.String
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
             
            const user = interaction.options.getUser("user");
            const member = interaction.guild.members.cache.get(user.id);
            let reason = interaction.options.getString("reason")
            if (!reason) reason = 'None'
            const permembed = new EmbedBuilder()
                .setTitle("❌ ERROR")
                .setColor("Red")
                .setDescription("You don't have required permissions.")
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            const notmember = new EmbedBuilder()
                .setTitle("❌ ERROR")
                .setColor("Red")
                .setDescription("Please provide a valid member to mute.")
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();


            const roleembed = new EmbedBuilder()
                .setTitle("❌ Error")
                .setColor("Red")
                .setDescription("You cannot mute someone having role equal or higher than you.")
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();


            const muter = new EmbedBuilder()
                .setTitle("MUTED")
                .setColor("Green")
                .setDescription(`✅ Successfully Muted ${member} as requested by ${interaction.member.user.tag}.`)
                .addFields({ name: "Reason:", value: reason })
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            const mutedr = new EmbedBuilder()
                .setTitle("MUTED")
                .setColor("Green")
                .setDescription(`You have been muted by ${interaction.member.user.tag}.`)
                .addFields(
                    { name: "Guild", value: interaction.guild.name },
                    { name: "Reason:", value: reason }
                )
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();
            let muterole = interaction.guild.roles.cache.find(role => role.name === "Fuca-Muted");
            if (interaction.member.permissions.has("ManageMessages") || interaction.member.permissions.has("Administrator")) {
                if (!member) return await interaction.editReply({ embeds: [notmember] })
                if (member.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.editReply({ embeds: [roleembed] })
                let size = interaction.guild.roles.cache.size / 2
                if (!muterole) {
                    try {
                        try {
                            let muterole = await interaction.guild.roles.create({
                                name: "Fuca-Muted",
                                color: Colors.NotQuiteBlack,
                                reason: 'This is a muted role which will be used by Fuca.',
                                Permissions: ['ViewChannel', 'CREATE_INSTANT_INVITE', 'READ_MESSAGE_HISTORY'],
                                position: size
                            })
                            interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(async (channel, id) => {
                                channel.permissionOverwrites.create(muterole, {
                                    SendMessages: false
                                })
                            })
                        } catch (err) {
                            let muterole = await interaction.guild.roles.create({
                                name: "Fuca-Muted",
                                color: Colors.NotQuiteBlack,
                                reason: 'This is a muted role which will be used by Fuca.',
                                Permissions: ['ViewChannel', 'CREATE_INSTANT_INVITE', 'READ_MESSAGE_HISTORY'],
                            })
                            interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(async (channel, id) => {
                                channel.permissionOverwrites.create(muterole, {
                                    SendMessages: false
                                })
                            })
                        }
                    } catch (err) {
                        return await interaction.editReply(`Unable to create mute role ${err}`)
                    }
                }
                muterole = interaction.guild.roles.cache.find(role => role.name === "Fuca-Muted");
                if (member.roles.cache.has(muterole.id)) return await interaction.editReply("This member is already muted.")
                try {
                    await member.roles.add(muterole)
                    await interaction.editReply({
                        content: 'Muted',
                        embeds: [muter],
                    })
                    try {
                        await member.send({ embeds: [mutedr] })
                    } catch (err) {
                        interaction.followUp(`Muted but can't dm member: \n${err}`)
                    }
                } catch (err) {
                    const iperm = new EmbedBuilder()
                        .setTitle("❌ ERROR")
                        .setColor("Red")
                        .setDescription("Somthing went wrong.")
                        .addFields({ name: "Error:", value: err })
                        .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                        .setTimestamp();
                    await interaction.editReply({
                        content: "Error",
                        embeds: [iperm],
                    })
                }
            } else {
                return await interaction.editReply({ embeds: [permembed] })
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN MUTE (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
