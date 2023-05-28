const app = require('express').Router();
const client = require('../../index.js')
const welcomedb = require("../../Detabase/welcome.js");
const { ChannelType } = require('discord.js');

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

app.get("/:id/welcome", global.checkAuth, async (req, res) => {

    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }
    let guild = client.guilds.cache.get(req.params.id);
    let x = guild.channels.cache.filter(e => e.type === ChannelType.GuildText)
    let a = [];

    const welcome = await welcomedb.findOne({ id: req.params.id }) || await welcomedb.create({ id: req.params.id });
    let img = '  https://fuca.fluiddev.xyz/assets/img/bg.jpeg';
    let msg = '{mention} Welcome to {guild}!';
    if (welcome) {
        if (welcome.enable === true) {
            if (welcome.bgimage) {
                img = welcome.bgimage
            }
            if (welcome.message) {
                msg = welcome.message
            }

        } else if (welcome.enable === false) {
            return res.redirect("/dashboard");
        }
    } else if (!welcome) {
        return res.redirect("/dashboard");
    }

    for (const value of x) {
        a.push(value)
    }
    let allRoles = client.guilds.cache.get(gui.id).roles.cache.filter(e => e.managed === false && e.name !== "@everyone");
    let rolesNoIgnore = [];
    for (const value of allRoles) {
        rolesNoIgnore.push(value)
    }



    res.render("welcome-settings", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${req.user.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),
        req: req,
        guild_roles: rolesNoIgnore,
        bot: client,
        guild_channels: a,
        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
        img: img,
        message: msg,
    });
});

app.post("/:id/welcomechannel/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await welcomedb.findOneAndUpdate({ id: id }, { channel: data.channels });
    await res.redirect(`/guild/${req.params.id}/welcome`);
})

app.post("/:id/welcome/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    let image;
    let msg
    if (data.image === '') {
        image = '  https://fuca.fluiddev.xyz/assets/img/bg.jpeg'
    } else {
        image = data.image
    }
    if (data.msg === '') {
        msg = '{mention} Welcome to {guild}!'
    } else {
        msg = data.msg
    }
    await welcomedb.findOneAndUpdate({ id: id }, { bgimage: image })
    await welcomedb.findOneAndUpdate({ id: id }, { message: msg })
    await res.redirect(`/guild/${req.params.id}/welcome`);
})

app.post("/:id/welcome/roles/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await welcomedb.findOneAndUpdate({ id: id }, { roleid: data.roles });
    await res.redirect(`/guild/${req.params.id}/welcome`);
})

module.exports = app;