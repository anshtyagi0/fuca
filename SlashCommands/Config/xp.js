const configs = require("../../Detabase/guildConfig.js")
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');

module.exports = {

    name: "xp",
    description: "Manage Leveling system of your server",
    options: [{
        name: "enable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Enable the XP system in your server",
    }, {
        name: "disable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Disable the XP system in your server",
    }, {
        name: "rate",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Change the XP rate of your server",
        options: [{
            name: "rate",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            description: "The percantage of XP Rate"
        }]
    }, {
        name: "limits",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Change the XP icrement limits for your server",
        options: [{
            name: "up-limit",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            description: "The maximum XP increment"
        }, {
            name: "down-limit",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            description: "The minimum XP increment"
        }]
    }, {
        name: "level-up-message",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Change the level up message for your server",
        options: [{
            name: "message",
            type: ApplicationCommandOptionType.String,
            required: true,
            description: "The new level up message, you can use these: {level} {xp} {mention}"
        }]
    }, {
        name: "level-up-message-enable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Enable the XP level up mesage in your server",
    }, {
        name: "level-up-message-disable",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Disable the XP level up mesage in your server",
    }, {
        name: "level-up-channel",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Change the level up message channel",
        options: [{
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            description: "Mention the channel or give ID, 0 for same channel message",
            required: true
        }]
    }, {
        name: "ignore-channel-add",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Add ignore XP Channel",
        options: [{
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            description: "Mention the channel to disable XP increment",
            required: true
        }]
    }, {
        name: "ignore-channel-remove",
        type: ApplicationCommandOptionType.Subcommand,
        description: "remove ignore XP Channel",
        options: [{
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            description: "Mention the channel to re-enable XP increment",
            required: true
        }]
    }, {
        name: "custom-background-rank",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Add a custom background to rank command. Only png and jpeg",
        options: [{
            name: "url",
            type: ApplicationCommandOptionType.String,
            required: true,
            description: "Enter the url for image."
        }]
    }]
    ,
    permissions: ["MANAGE_SERVER"],

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
             
            await interaction.editReply({ content: `${client.user.username} is thinking...` });
            if (interaction.member.permissions.has("ManageGuild") || interaction.member.permissions.has("Administrator")) {

                const option = interaction.options.getSubcommand(true).toLowerCase(),
                    data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });

                data.levelReward = data.levelReward || {};

                const rate = interaction.options.getInteger("rate"),
                    ul = Math.floor(interaction.options.getInteger("up-limit")),
                    dl = Math.floor(interaction.options.getInteger("down-limit")),
                    message = interaction.options.getString("message"),
                    bgrank = interaction.options.getString("url"),
                    s_message = interaction.options.getString("success-message"),
                    f_message = interaction.options.getString("fail-message"),
                    role = interaction.options.getRole("role"),
                    level = interaction.options.getString("level"),
                    channel = interaction.options.get("channel")?.value;

                if (option === "enable") {
                    if (data.xp) return interaction.editReply({ content: "XP System is already enabled" });

                    interaction.editReply({ content: "XP System is now enabled" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: true })
                } else if (option === "disable") {
                    if (!data.xp) return interaction.editReply({ content: "XP System is already disabled" });

                    interaction.editReply({ content: "XP System is now disabled" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: false })
                } else if (option === "rate") {
                    if (rate < 0 || rate > 1000) return interaction.editReply({ content: "Please provide valid XP Rate from 1% to 1000% ( you don't have to type % just the number will work )" })

                    interaction.editReply({ content: `XP rate is change to ${rate}%` });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { xpRate: rate / 100 })
                } else if (option === "limits") {
                    if (dl > ul || ul < 0 || ul > 1000 || dl < 0 || dl > 1000) return interaction.editReply({ content: "Please provide valid XP increment limits from 1 to 1000 and up limit should be more than down limit" })
                    if (!dl && !ul) return interaction.editReply({ content: "Please provide either of the XP increment limit i.e. up or down" })

                    ul = ul || data.xpLimit.up;
                    dl = dl || data.xpLimit.down;

                    interaction.editReply({ content: `XP increment is change to:\nup limit: ${ul}\ndown limit: ${dl}` });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLimit.up": ul, "xpLimit.down": dl })
                } else if (option === "level-up-message-enable") {
                    if (data.xpLevelUP.enable) return interaction.editReply({ content: "XP level up message is already enabled" });

                    interaction.editReply({ content: "XP level up message is now enabled" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUP.enable": true })
                } else if (option === "level-up-message-disable") {
                    if (!data.xpLevelUP.xp) return interaction.editReply({ content: "XP level up message is already disabled" });

                    interaction.editReply({ content: "XP level up message is now disabled" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUP.enable": false })
                } else if (option === "level-up-message") {
                    interaction.editReply({ content: "XP level up message is now changed" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUP.message": message })
                } else if (option === "level-up-channel") {
                    let c = interaction.guild.channels.cache.get(channel) || interaction.guild.channels.cache.get(channel.substring(2, channel.length - 1))

                    if ((!c && channel !== "0") || (c && channel !== "0" && c.type !== "GUILD_TEXT"))
                        return interaction.editReply({ content: "Either type 0 for same channel message or give a valid Text channel ID" });

                    interaction.editReply({ content: "XP level up message channel is now changed" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUP.channel": channel === "0" ? channel : c.id })
                } else if (option === "ignore-channel-add") {
                    if (data.ignoreXP.includes("channel"))
                        return interaction.editReply({ content: "Yo nerd this channel is already disabled for xp increment" });

                    interaction.editReply({ content: "Now the mentioned channel will not get xp incremenets" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { $push: { ignoreXP: channel.id } })
                } else if (option === "ignore-channel-remove") {
                    if (!data.ignoreXP.includes("channel"))
                        return interaction.editReply({ content: "Yo nerd, this channel is not disabled for xp increment" });

                    interaction.editReply({ content: "Now the mentioned channel will get xp incremenets" });

                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { $pull: { ignoreXP: channel.id } })
                } else if (option === 'custom-background-rank') {
                    await configs.findOneAndUpdate({ id: interaction.guild.id }, { bgrank: bgrank })

                    await interaction.editReply({ content: 'Updated the bg for rank command.' });
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
