const giveawaydata = require("../Detabase/giveaway.js")
const ticketdata = require("../Detabase/tickettool.js")
const tickets = require("../Detabase/tickets.js")
const transcriptdata = require("../Detabase/transcript.js")
const discordTranscripts = require('discord-html-transcripts');
const reports = require("../Detabase/report.js")
const { createCanvas, loadImage } = require('canvas');
const config = require("../Detabase/guildConfig.js")
const verify = require("../Detabase/verify.js")
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, Client, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ApplicationCommandOptionType, ButtonStyle, PermissionsBitField, ChannelType, AttachmentBuilder } = require('discord.js');
module.exports = async (client, interaction) => {
    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {CommandInteraction} interaction
     */

    if (interaction.isSelectMenu()) {
        if (interaction.customId == 'CLAIM-report') {
            const msgid = interaction.message.id
            const channel = interaction.channel
            const data = await reports.findOne({ id: msgid })
            if (data) {
                if ((interaction.values[0]).toString() === 'claim') {
                    let user = data.user
                    let report = data.report
                    const embed = new EmbedBuilder()
                        .setTitle('REPORT VERIFIED')
                        .addFields(
                            { name: 'What is the problem?', value: report },
                            { name: 'Command', value: data.cmd }
                        )

                    interaction.message.delete()
                    client.users.cache.get(user).send({ content: 'Report verified', embeds: [embed] })
                    await reports.deleteOne({ id: interaction.message.id })
                    await interaction.reply({ content: 'DONE', ephemeral: true })
                } else if ((interaction.values[0]).toString() === 'decline') {
                    let user = data.user
                    let report = data.report
                    const embed = new EmbedBuilder()
                        .setTitle('REPORT DECLINED')
                        .addFields(
                            { name: 'What is the problem?', value: report },
                            { name: 'Command', value: data.cmd }
                        )

                    interaction.message.delete()
                    client.users.cache.get(user).send({ content: 'Report DECLINED', embeds: [embed] })
                    await reports.deleteOne({ id: msgid })
                    await interaction.reply({ content: 'DONE', ephemeral: true })
                }
            } else {
                await interaction.reply({ content: 'DATA NOT FOUND!', ephemeral: true })
            }
        }
    }
    if (interaction.isButton()) {
        if (interaction.customId === 'ENTER-GIVEAWAY') {
            const msgid = (interaction.message.id)
            const data = await giveawaydata.findOne({ messageID: msgid })
            const newuser = {
                id: interaction.member.user.id,
                username: interaction.member.user.tag
            }
            if (data) {
                if (data.active == false) {
                    return await interaction.reply({ content: "Giveaway ended", ephemeral: true })
                }
                const userdata = data.userlist.find((x) => x.id === interaction.member.user.id)
                if (userdata) {
                    const filtereduser = data.userlist.filter(x => x.id !== interaction.member.user.id)
                    data.userlist = filtereduser
                    const users = (parseInt(data.users) - 1).toString()
                    data.users = users
                    await data.save()
                    const embed = new EmbedBuilder()
                        .setTitle(data.title)
                        .setDescription("Click button 🎉 below to enter!")
                        .addFields(
                            { name: 'HOST', value: `<@${data.host}>` },
                            { name: 'Ends in', value: `<t:${data.endat}>` },
                            { name: 'Winners', value: data.winners },
                            { name: 'Users', value: users }
                        )
                    interaction.message.edit({ embeds: [embed] })
                    return await interaction.reply({ content: "Removed from giveaway 😢", ephemeral: true })
                }
                const users = (parseInt(data.users) + 1).toString()
                data.userlist = [...data.userlist, newuser]
                data.users = users
                await data.save();
                const embed = new EmbedBuilder()
                    .setTitle(data.title)
                    .setDescription("Click button 🎉 below to enter!")
                    .addFields(
                        { name: 'HOST', value: `<@${data.host}>` },
                        { name: 'Ends in', value: `<t:${data.endat}>` },
                        { name: 'Winners', value: data.winners },
                        { name: 'Users', value: users }
                    )
                interaction.message.edit({ embeds: [embed] })
                return await interaction.reply({ content: "Entered giveaway 🎉", ephemeral: true })
            } else if (!data) {
                return await interaction.reply({ content: "Giveaway ended", ephemeral: true })
            }
        }
        if (interaction.customId === 'ticket') {
            const guildId = (interaction.guild.id)
            const data = await ticketdata.findOne({ guildId: guildId })
            if (data) {
                const userdata = await tickets.findOne({ user: interaction.member.user.id })
                if (userdata) {
                    return await interaction.reply({ content: `You already have a ticket opened <#${userdata.channel}>`, ephemeral: true })
                }
                data.opens = data.opens + 1
                data.total = data.total + 1
                await data.save();
                let channel;
                let everyone = interaction.guild.roles.cache.find(role => role.name === "@everyone");
                if (data.category) {
                    if (data.roles) {
                        let role = interaction.guild.roles.cache.find(role => role.id === data.roles)
                        channel = await interaction.guild.channels.create({
                            name: `Ticket -${(data.total).toString()}`,
                            type: ChannelType.GuildText,
                            topic: `Ticket for ${interaction.member.user.username}`,
                            parent: data.category,
                            permissionOverwrites: [
                                {
                                    id: interaction.member.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                },
                                {
                                    id: everyone,
                                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                },
                                {
                                    id: role.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                }
                            ],
                        })
                    } else {
                        channel = await interaction.guild.channels.create({
                            name: `Ticket -${(data.total).toString()}`,
                            type: ChannelType.GuildText,
                            topic: `Ticket for ${interaction.member.user.username}`,
                            parent: data.category,
                            permissionOverwrites: [
                                {
                                    id: interaction.member.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                },
                                {
                                    id: everyone,
                                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                }
                            ],
                        })
                    }
                } else {
                    if (data.roles) {
                        let role = interaction.guild.roles.cache.find(role => role.id === data.roles)
                        channel = await interaction.guild.channels.create({
                            name: `Ticket -${(data.total).toString()}`,
                            type: ChannelType.GuildText,
                            topic: `Ticket for ${interaction.member.user.username}`,
                            permissionOverwrites: [
                                {
                                    id: interaction.member.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                },
                                {
                                    id: everyone,
                                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                },
                                {
                                    id: role.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                }
                            ],
                        })
                    } else {
                        channel = await interaction.guild.channels.create({
                            name: `Ticket -${(data.total).toString()}`,
                            type: ChannelType.GuildText,
                            topic: `Ticket for ${interaction.member.user.username}`,
                            permissionOverwrites: [
                                {
                                    id: interaction.member.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                },
                                {
                                    id: everyone,
                                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                }
                            ],
                        })
                    }
                }
                const embed = new EmbedBuilder()
                    .setDescription("Support will be with you shortly.\nTo close this ticket react with 🔒")
                    .setFooter({ text: `Fuca - TicketTool`, iconURL: interaction.client.user.avatarURL({ dynamic: true }) })
                const btn = new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setCustomId("ticketlock").setLabel("Close").setStyle(ButtonStyle.Primary).setEmoji('🔒')
                ])
                channel.send({ embeds: [embed], components: [btn] })
                await tickets.create({
                    guild: guildId,
                    user: interaction.member.user.id,
                    channel: channel.id,
                    channelname: `Ticket - ${(data.total).toString()}`,
                    open: true
                })
                if (data.roles) channel.send(`<@&${data.roles}>`)
                return await interaction.reply({ content: `${channel} Created!`, ephemeral: true })
            }
        }
    }
    if (interaction.isButton()) {
        if (interaction.customId === 'ticketlock') {
            await interaction.deferReply({
                ephemeral: false
            });
            const guildId = (interaction.guild.id)
            const data = await tickets.findOne({ channel: interaction.channel.id })
            const data2 = await ticketdata.findOne({ guildId: guildId })
            if (data) {
                if (data.open === true) {
                    const btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId("close").setLabel("Close").setStyle(ButtonStyle.Danger),
                        new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Secondary)
                    ])
                    const d_btn = new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setCustomId("close").setLabel("Close").setStyle(ButtonStyle.Danger).setDisabled(true),
                        new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Secondary).setDisabled(true)
                    ])
                    interaction.followUp({ content: `Are you sure you would like to close this ticket?`, components: [btn] }).then(async (msg) => {
                        let filter = i => i.user.id === interaction.member.user.id;
                        let collector = await msg.createMessageComponentCollector({ filter: filter, time: 5000 * 60 });
                        let ab = 0
                        collector.on('collect', async (btn) => {
                            if (btn.isButton()) {
                                if (btn.customId === "close") {
                                    await btn.deferUpdate().catch((e => { }))
                                    data.open = false
                                    let embed = new EmbedBuilder()
                                        .setDescription(`Ticket closed by: <@${interaction.member.user.id}>`);
                                    let embed2 = new EmbedBuilder()
                                        .setDescription("```Support team ticket controls```");
                                    let btnrow = new ActionRowBuilder().addComponents([
                                        new ButtonBuilder().setCustomId("transcript").setLabel("📑 Transcript").setStyle(ButtonStyle.Secondary),
                                        new ButtonBuilder().setCustomId("ticketopen").setLabel("🔓 Open").setStyle(ButtonStyle.Secondary),
                                        new ButtonBuilder().setCustomId('ticketdelete').setLabel("⛔️ Delete").setStyle(ButtonStyle.Secondary)
                                    ])
                                    interaction.channel.send({ embeds: [embed] })
                                    interaction.channel.send({ embeds: [embed2], components: [btnrow] })
                                    data2.opens = data2.opens - 1
                                    data2.save()
                                    let user = interaction.guild.members.cache.find(user => user.id === data.user)
                                    await interaction.channel.permissionOverwrites.delete(user)
                                    console.log(1)
                                    await interaction.channel.setName(`Closed-${(data2.total).toString()}`)
                                    console.log(2)
                                    data.channelname = interaction.channel.name
                                    data.save();
                                    ab = 1
                                    return msg.delete()
                                } else if (btn.customId === 'cancel') {
                                    try {
                                        return msg.delete()
                                    } catch (err) {
                                        console.log(`msg already deleted`)
                                    }
                                }
                            }
                        })
                        collector.on('end', () => {
                            if (ab == 0) {
                                msg.delete()
                            }
                        })
                    })
                } else if (data.open === false) {
                    return interaction.editReply(`> **Ticket already closed**`)
                }
            }
        }
        if (interaction.customId === 'ticketopen') {
            await interaction.deferReply({
                ephemeral: false
            });
            const guildId = (interaction.guild.id)
            const data = await tickets.findOne({ channel: interaction.channel.id })
            const data2 = await ticketdata.findOne({ guildId: guildId })
            if (data) {
                if (data.open === false) {
                    let embed = new EmbedBuilder()
                        .setDescription(`Ticket Opened by <@${interaction.member.user.id}>`)
                    interaction.followUp({ embeds: [embed] })
                    data.open = true
                    data2.opens = data2.opens + 1
                    data2.save()
                    let user = interaction.guild.members.cache.find(user => user.id === data.user)
                    await interaction.channel.permissionOverwrites.create(user, {
                        SendMessages: true,
                        ViewChannel: true
                    })
                    await interaction.channel.setName(`Ticket-${(data2.total).toString()}`)
                    data.channelname = interaction.channel.name
                    data.save()
                    return interaction.message.delete()
                } else if (data.open === true) {
                    interaction.editReply(`Ticket is already opened!`)
                }
            }
        }
        if (interaction.customId === 'transcript') {
            const guildId = (interaction.guild.id)
            const data = await tickets.findOne({ channel: interaction.channel.id })
            const data2 = await ticketdata.findOne({ guildId: guildId })
            if (data) {
                if (data.open === false) {
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: `Ticket Owner`, value: `<@${data.user}>` },
                            { name: `Ticket Name`, value: `${data.channelname}` },
                            { name: `Direct Transcript`, value: `[CLICK ME](https://fuca.fluiddev.xyz/transcript/${guildId}/${data.user}/${interaction.channel.id})` }
                        )
                    if (data2.transcriptchannel) {
                        let trans = interaction.channel
                        const attachment2 = await discordTranscripts.createTranscript(trans, {
                            returnType: 'string',
                            footerText: 'Made with ❤️ by Ansh',
                            poweredBy: false
                        });
                        await transcriptdata.create({
                            content: attachment2,
                            link: `https://fuca.fluiddev.xyz/transcript/${guildId}/${data.user}/${interaction.channel.id}`,
                        })
                        const attachment = await discordTranscripts.createTranscript(trans);
                        let channel = interaction.guild.channels.cache.find(channel => channel.id === data2.transcriptchannel)
                        channel.send({ embeds: [embed], files: [attachment] })
                    } else {
                        let trans = interaction.channel
                        const attachment2 = await discordTranscripts.createTranscript(trans, {
                            returnType: 'string',
                            footerText: 'Made with ❤️ by Ansh',
                            poweredBy: false
                        });
                        await transcriptdata.create({
                            content: attachment2,
                            link: `https://fuca.fluiddev.xyz/transcript/${guildId}/${data.user}/${interaction.channel.id}`,
                        })
                        const attachment = await discordTranscripts.createTranscript(trans);
                        interaction.channel.send({ embeds: [embed], files: [attachment] })
                    }
                } else if (data.open === true) {
                    interaction.editReply(`Ticket should be closed to generate transcript!`)
                }
            }
        }
        if (interaction.customId === 'ticketdelete') {
            const guildId = (interaction.guild.id)
            const data = await tickets.findOne({ channel: interaction.channel.id })
            const data2 = await ticketdata.findOne({ guildId: guildId })
            if (data) {
                if (data.open === false) {
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: `Ticket Owner`, value: `<@${data.user}>` },
                            { name: `Ticket Name`, value: `${data.channelname}` },
                            { name: `Direct Transcript`, value: `[CLICK ME](https://fuca.fluiddev.xyz/transcript/${guildId}/${data.user}/${interaction.channel.id})` }
                        )
                    if (data2.transcriptchannel) {
                        let trans = interaction.channel
                        const attachment2 = await discordTranscripts.createTranscript(trans, {
                            returnType: 'string',
                            footerText: 'Made with ❤️ by Ansh',
                            poweredBy: false
                        });
                        await transcriptdata.create({
                            content: attachment2,
                            link: `https://fuca.fluiddev.xyz/transcript/${guildId}/${data.user}/${interaction.channel.id}`,
                        })
                        const attachment = await discordTranscripts.createTranscript(trans, {
                            returnType: 'attachment',
                            footerText: 'Made with ❤️ by Ansh',
                            poweredBy: false,
                            filename: `${data.user}-Ticket.html`
                        });
                        let channel = interaction.guild.channels.cache.find(channel => channel.id === data2.transcriptchannel)
                        channel.send({ embeds: [embed], files: [attachment] })
                    } else {
                        let trans = interaction.channel
                        const attachment2 = await discordTranscripts.createTranscript(trans, {
                            returnType: 'string',
                            footerText: 'Made with ❤️ by Ansh',
                            poweredBy: false
                        });
                        await transcriptdata.create({
                            content: attachment2,
                            link: `https://fuca.fluiddev.xyz/transcript/${guildId}/${data.user}/${interaction.channel.id}`,
                        })
                        const attachment = await discordTranscripts.createTranscript(trans, {
                            returnType: 'attachment',
                            footerText: 'Made with ❤️ by Ansh',
                            poweredBy: false,
                            filename: `${data.user}-Ticket.html`
                        });
                        interaction.channel.send({ embeds: [embed], files: [attachment] })
                    }
                    data.delete()
                    interaction.channel.delete()
                } else if (data.open === true) {
                    interaction.reply(`Ticket should be closed to delete channel!`)
                }
            }
        }
        if (interaction.customId === 'verify') {
            const guild = interaction.guild.id
            const user = interaction.member.id
            const data = await config.findOne({ id: guild }) || await config.create({ id: guild })
            const userdata = await verify.findOne({ guild: guild, user: user }) || await verify.create({ guild: guild, user: user })
            if (data.verify) {
                if (userdata.verified) {
                    return interaction.reply({ content: `You are already verified.`, ephemeral: true })
                } else {
                    let correct = userdata.correct || generateRandomCaptchaCode()
                    userdata.correct = correct
                    let wrong = generateRandomCaptchaCode()
                    let wrong2 = generateRandomCaptchaCode()
                    let randomNumber = getRandomInt(1, 3);
                    let button;
                    if (randomNumber == 1) { // wrong, correct, wrong
                        button = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId(`${wrong}`).setLabel(`${wrong}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId(`${correct}`).setLabel(`${correct}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId(`${wrong2}`).setLabel(`${wrong2}`).setStyle(ButtonStyle.Primary)
                        ])
                    } else if (randomNumber == 2) { // correct, wrong, wrong
                        button = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId(`${correct}`).setLabel(`${correct}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId(`${wrong}`).setLabel(`${wrong}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId(`${wrong2}`).setLabel(`${wrong2}`).setStyle(ButtonStyle.Primary)
                        ])
                    } else if (randomNumber == 3) { // wrong, wrong, correct
                        button = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId(`${wrong2}`).setLabel(`${wrong2}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId(`${wrong}`).setLabel(`${wrong}`).setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId(`${correct}`).setLabel(`${correct}`).setStyle(ButtonStyle.Primary)
                        ])
                    }
                    const canvas = createCanvas(200, 80); // Set the desired width and height of the CAPTCHA image
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw text on the canvas
                    ctx.font = 'bold 40px Arial'; // Set the font style and size
                    ctx.fillStyle = 'black'; // Set the text color
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(correct, canvas.width / 2, canvas.height / 2);

                    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'captcha.png' })

                    let embed = new EmbedBuilder()
                        .setTitle('Verification Required')
                        .setDescription(`Click the correct code below.`)
                        .setImage(`attachment://${attachment.name}`);
                    let embed2 = new EmbedBuilder()
                        .setTitle('Verification Completed')
                        .setDescription(`Verified!`)
                    let embed3 = new EmbedBuilder()
                        .setTitle('Verification Failed')
                        .setDescription(`Failed to verify!`)
                    await interaction.reply({ embeds: [embed], components: [button], files: [attachment], ephemeral: true }).then(async (msg) => {
                        let filter = i => i.user.id === interaction.member.user.id;
                        let collector = await msg.createMessageComponentCollector({ filter: filter, time: 5000 * 60 });
                        let ab = 0
                        let btns = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId(`Verified`).setLabel(`Verified!`).setStyle(ButtonStyle.Primary).setDisabled(true),
                        ])
                        let btn2 = new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setCustomId(`unVerified`).setLabel(`Failed to verify`).setStyle(ButtonStyle.Danger).setDisabled(true),
                        ])
                        collector.on('collect', async (btn) => {
                            if (btn.isButton()) {
                                if (btn.customId === `${correct}`) {
                                    await btn.deferUpdate().catch((e => { }))
                                    userdata.verified = true
                                    await interaction.editReply({ content: 'Thank you! You are now verified.', embeds: [embed2], components: [btns], ephemeral: true })
                                    await userdata.save();
                                    ab = 1
                                    return await interaction.member.roles.add(data.verifyrole)
                                } else if (btn.customId === `${wrong}`) {
                                    ab = 1
                                    return await interaction.editReply({ content: 'Wrong selection.', embeds: [embed3], components: [btn2], ephemeral: true })
                                } else if (btn.customId === `${wrong2}`) {
                                    ab = 1
                                    return await interaction.editReply({ content: 'Wrong selection.', embeds: [embed3], components: [btn2], ephemeral: true })
                                }
                            }
                        })
                    })
                    // send embed with image and buttons
                }
            } else {
                return interaction.reply({ content: `Sorry! Verification is disabled by server admins.`, ephemeral: true })
            }
        }
    }
}

function generateRandomCaptchaCode() {
    // Define a variable consisting of all lowercase and uppercase letters.
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Specify the length for the new string.
    var lenString = 5;

    // Create an empty string to hold the generated string.
    var randomstring = "";

    // Loop to select a new character in each iteration.
    for (var i = 0; i < lenString; i++) {
        // Generate a random number between 0 and the length of the characters string.
        var rnum = Math.floor(Math.random() * characters.length);

        // Add the character at the random index to the randomstring variable.
        randomstring += characters.substring(rnum, rnum + 1);
    }

    // Return the generated string.
    return randomstring;
}
function getRandomInt(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}