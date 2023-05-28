const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, StringSelectMenuBuilder, Events } = require('discord.js');
const premiumScheme = require("../Detabase/premiumScheme.js");
const usersdata = require("../Detabase/term.js")
module.exports = async (client, interaction) => {

    let prefix = client.prefix;
    let color = client.config.Bot.Color;

    if (interaction.isCommand()) {
        if (!interaction.guild) return;
        const SlashCommands = client.slashCommands.get(interaction.commandName);
        if (!SlashCommands) return;
        let a = await checkfirst(interaction)
        if (a=='no') return;
        try {
            if (SlashCommands.premium) {
                const data = await premiumScheme.findOne({
                    Guild: interaction.guild.id
                })
                if (!data) return interaction.reply("This is a premium command.");

                if (!data.Permanent && Date.now() > data.Expire) {
                    data.delete();
                    return interaction.reply("This premium system is expired! :(")
                }
            }
        } catch (err) {
            console.log(err)
        }
        try {
            SlashCommands.run(client, interaction, prefix);
        } catch (error) {
            if (interaction.replied) {
                await interaction.editReply({
                    content: `An unexcepted error occured.`
                }).catch(() => { });
            } else {
                await interaction.followUp({
                    ephemeral: true,
                    content: `An unexcepted error occured.`
                }).catch(() => { });
            }
            console.error(error);
        };
    }

    if (interaction.isSelectMenu()) {
        if (interaction.customId !== 'reaction-roles') return;
        await interaction.deferReply({ ephemeral: true });
        const roleId = interaction.values[0];
        const role = interaction.guild.roles.cache.get(roleId)
        const member = interaction.member.roles;
        const hasRole = member.cache.has(roleId);
        if (hasRole) {
            try {
                member.remove(roleId)
                interaction.followUp({ content: `${role.name} has been removed from you.`, ephemeral: true })
            } catch (err) {
                interaction.followUp({ content: `Something went wrong: ${err}`, ephemeral: true })
            }
        } else {
            try {
                member.add(roleId)
                interaction.followUp({ content: `${role.name} added to you.`, ephemeral: true })
            } catch (err) {
                interaction.followUp({ content: `Something went wrong: ${err}`, ephemeral: true })
            }
        }


    }
}

async function checkfirst(interaction) {
    let a = 0
    const data22 = await usersdata.findOne({ user: interaction.member.user.id })
    if (data22) {
        if (data22.first === true) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Fuca Bot Rules', iconURL: 'https://cdn.discordapp.com/avatars/1019613932211675237/8ea5d869e8c8c38310c54dddbe2eb707.webp' })
                .setTitle("Before continuing read our terms of use and privacy policy and agree to them.")
                .setDescription("Click the button below to accept our terms of use and privacy policy")
                .addFields(
                    { name: "Terms Of Use", value: '[CLICK ME](https://fuca.fluiddev.xyz/termsofuse)' },
                    { name: "Privacy Policy", value: '[CLICK ME](https://fuca.fluiddev.xyz/privacypolicy)' },
                    { name: "Contact Us", value: 'If you have any doubt join our discord server: [CLICK ME](https://discord.gg/v8YSWmF88v)' }
                )
                .setFooter({ text: `Copyright © Fuca` })
                .setColor("Green")
            let msgbutton = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId("accept").setLabel("👍 I accept the Fuca Bot Rules").setStyle(ButtonStyle.Primary)
            ])
            let d_msgbutton = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId("accept").setLabel("👍 I accept the Fuca Bot Rules").setStyle(ButtonStyle.Primary).setDisabled(true)
            ])
            await interaction.reply({
                content: ':warning: **You must accept these rules to use the bot!**',
                embeds: [embed],
                components: [msgbutton],
            }).then(async (msg) => {
                let filter = i => i.user.id === interaction.member.user.id;
                let collector = await msg.createMessageComponentCollector({ filter: filter, time: 5000 * 60 });
                collector.on('collect', async (btn) => {
                    if (btn.isButton()) {
                        if (btn.customId === "accept") {
                            await btn.deferUpdate().catch((e => { }))
                            data22.first = false
                            await data22.save()
                            a = 1
                            return await interaction.editReply({ content: 'Thank you for accepting our rules.', components: [d_msgbutton] })
                        }
                    }
                })
                collector.on('end', () => {
                    a = 1
                    return interaction.editReply({ embeds: [embed], components: [d_msgbutton] })
                })
            })
        } else if (data22.first === false) {
            console.log("Already accepted the rules.")
            a = 1
        }
    } else if (!data22) {
        await usersdata.create({
            user: interaction.member.user.id,
            first: true
        })
        const data222 = await usersdata.findOne({ user: interaction.member.user.id })
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Fuca Bot Rules', iconURL: 'https://cdn.discordapp.com/avatars/1019613932211675237/8ea5d869e8c8c38310c54dddbe2eb707.webp' })
            .setTitle("Before continuing read our terms of use and privacy policy and agree to them.")
            .setDescription("Click the button below to accept our terms of use and privacy policy")
            .addFields(
                { name: "Terms Of Use", value: '[CLICK ME](https://fuca.fluiddev.xyz/termsofuse)' },
                { name: "Privacy Policy", value: '[CLICK ME](https://fuca.fluiddev.xyz/privacypolicy)' },
                { name: "Contact Us", value: 'If you have any doubt join our discord server: [CLICK ME](https://discord.gg/v8YSWmF88v)' }
            )
            .setFooter({ text: `Copyright © Fuca` })
            .setColor("Green")
        let msgbutton = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId("accept").setLabel("👍 I accept the Fuca Bot Rules").setStyle(ButtonStyle.Primary)
        ])
        let d_msgbutton = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId("accept").setLabel("👍 I accept the Fuca Bot Rules").setStyle(ButtonStyle.Primary).setDisabled(true)
        ])
        await interaction.reply({
            content: ':warning: **You must accept these rules to use the bot!**',
            embeds: [embed],
            components: [msgbutton],

        }).then(async (msg) => {
            let filter = i => i.user.id === interaction.member.user.id;
            let collector = await msg.createMessageComponentCollector({ filter: filter, time: 5000 * 60 });
            collector.on('collect', async (btn) => {
                if (btn.isButton()) {
                    if (btn.customId === "accept") {
                        await btn.deferUpdate().catch((e => { }))
                        data222.first = false
                        await data222.save()
                        a = 1
                        return await interaction.editReply({ content: 'Thank you for accepting our rules.', components: [d_msgbutton] })
                    }
                }
            })
            collector.on('end', () => {
                a = 1
                return interaction.editReply({ embeds: [embed], components: [d_msgbutton] })
            })
        })
    }
    if (a === 0) {
        return 'no'
    } else if (a > 0) {
        return 'yes'
    }
}