const app = require('express').Router();
const client = require('../../index.js')
const ticketdb = require("../../Detabase/tickettool.js")
const { CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, StringSelectMenuBuilder, ApplicationCommandOptionType, ButtonStyle, ChannelType  } = require('discord.js');
function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
}

app.get("/:id/ticket", global.checkAuth, async (req, res) => {

    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }
    let guild = client.guilds.cache.get(req.params.id);
    let x = guild.channels.cache.filter(e => e.type === ChannelType.GuildText)
    let cat = guild.channels.cache.filter(e => e.type === ChannelType.GuildCategory)
    let a = [];
    let b = [];
    let name = 'Support Ticket'
    const data = await ticketdb.findOne({ guildId: req.params.id }) || await ticketdb.create({ guildId: req.params.id });
    if (data) {
        name = data.name
    }
    for (const value of x) {
        a.push(value)
    }
    for (const value of cat) {
        b.push(value)
    }
    let allRoles = client.guilds.cache.get(gui.id).roles.cache.filter(e => e.managed === false && e.name !== "@everyone");
    let rolesNoIgnore = [];
    for (const value of allRoles) {
        rolesNoIgnore.push(value)
    }



    res.render("ticket", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${req.user.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),
        req: req,
        guild_roles: rolesNoIgnore,
        bot: client,
        guild_channels: a,
        guild_category: b,
        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
        name: name
    });
});

app.post("/:id/ticketchannel/send", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    let db = await ticketdb.findOne({ guildId: id })
    const embed = new EmbedBuilder()
        .setTitle(db.name)
        .setDescription("To create a ticket react with 📩")
        .setColor('BLURPLE')
        .setFooter({ text: `Fuca - TicketTool`, iconURL: client.user.avatarURL({ dynamic: true }) })
    const btn = new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId("ticket").setLabel("Create Ticket").setStyle(ButtonStyle.Primary).setEmoji('📩')
    ])
    let channels = data.channels
    gui.channels.cache.find(channel => channel.id === channels).send({ embeds: [embed], components: [btn] })
    await res.redirect(`/guild/${req.params.id}/ticket`);
})

app.post("/:id/tickettranscript/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await ticketdb.findOneAndUpdate({ guildId: id }, { transcriptchannel: data.channels })
    await res.redirect(`/guild/${req.params.id}/ticket`);
})

app.post("/:id/ticketrole/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await ticketdb.findOneAndUpdate({ guildId: id }, { roles: data.roles });
    await res.redirect(`/guild/${req.params.id}/ticket`);
})

app.post("/:id/ticketname/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await ticketdb.findOneAndUpdate({ guildId: id }, { name: data.name })
    await res.redirect(`/guild/${req.params.id}/ticket`);
})

app.post("/:id/ticketcategory/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await ticketdb.findOneAndUpdate({ guildId: id }, { category: data.category })
    await res.redirect(`/guild/${req.params.id}/ticket`);
})

module.exports = app;