const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Will unmute a member.',
    options: [
        {
            name: 'user',
            description: 'Mention user you want to unmute.',
            required: true,
            type: ApplicationCommandOptionType.User
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
            const permembed = new EmbedBuilder()
                .setTitle("❌ ERROR")
                .setColor("Red")
                .setDescription("You don't have required permissions.")
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            const notmember = new EmbedBuilder()
                .setTitle("❌ ERROR")
                .setColor("Red")
                .setDescription("Please provide a valid member to unmute.")
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();


            const roleembed = new EmbedBuilder()
                .setTitle("❌ Error")
                .setColor("Red")
                .setDescription("You cannot unmute someone having role equal or higher than you.")
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            const muter = new EmbedBuilder()
                .setTitle("MUTED")
                .setColor("Green")
                .setDescription(`✅ Successfully Unmuted ${member} as requested by ${interaction.member.user.tag}.`)
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();

            const mutedr = new EmbedBuilder()
                .setTitle("MUTED")
                .setColor("Green")
                .setDescription(`You have been unmuted by ${interaction.member.user.tag}.`)
                .addFields({ name: "Guild", value: interaction.guild.name })
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                .setTimestamp();
            let muterole = interaction.guild.roles.cache.find(role => role.name === "Fuca-Muted");
            if (interaction.member.permissions.has("ManageMessages") || interaction.member.permissions.has("Administrator")) {
                if (!member) return await interaction.editReply({ embeds: [notmember] })
                if (!member.roles.cache.has(muterole.id)) return await interaction.editReply("This member is already unmuted.")
                if (member.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.editReply({ embeds: [roleembed] })
                if (!muterole) {
                    try {
                        try {
                            let muterole = await interaction.guild.roles.create({
                                name: "Fuca-Muted",
                                color: "BLACK",
                                reason: 'This is a muted role which will be used by Fuca.',
                                Permissions: ['ViewChannel', 'CREATE_INSTANT_INVITE', 'READ_MESSAGE_HISTORY'],
                                position: size
                            })
                            interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                                channel.permissionOverwrites.create(muterole, {
                                    SendMessages: false
                                })
                            })
                        } catch (err) {
                            let muterole = await interaction.guild.roles.create({
                                name: "Fuca-Muted",
                                color: "BLACK",
                                reason: 'This is a muted role which will be used by Fuca.',
                                Permissions: ['ViewChannel', 'CREATE_INSTANT_INVITE', 'READ_MESSAGE_HISTORY'],
                            })
                            interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                                channel.permissionOverwrites.create(muterole, {
                                    SendMessages: false
                                })
                            })
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }

                try {
                    await member.roles.remove(muterole)
                    await interaction.editReply({
                        content: 'Unmuted',
                        embeds: [muter],
                    })
                    try {
                        await member.send({ embeds: [mutedr] })
                    } catch (err) {
                        interaction.followUp(`Unmuted but can't dm member: \n${err}`)
                    }
                } catch (err) {
                    const iperm = new EmbedBuilder()
                        .setTitle("❌ ERROR")
                        .setColor("Red")
                        .setDescription("Somthing went wrong.")
                        .addFields({ name: "Error:", value: `${err}` })
                        .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.defaultAvatarURL })
                        .setTimestamp();
                    await interaction.editReply({
                        content: "Error",
                        embeds: [iperm],
                        components: [d_btnraw]
                    })
                }
            } else {
                return await interaction.editReply({ embeds: [permembed] })
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN UNMUTE (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
