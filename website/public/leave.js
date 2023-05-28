const app = require('express').Router();
const client = require('../../index.js')
const leavedb = require("../../Detabase/leave.js");
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

app.get("/:id/leave", global.checkAuth, async (req, res) => {

    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }
    let guild = client.guilds.cache.get(req.params.id);
    let x = guild.channels.cache.filter(e => e.type === ChannelType.GuildText)
    let a = [];

    const leave = await leavedb.findOne({ id: req.params.id }) || await leavedb.create({ id: req.params.id });
    let img = '  https://fuca.fluiddev.xyz/assets/img/bg.jpeg';
    let msg = '{mention} Left the {guild}!';
    if (leave) {
        if (leave.enable === true) {
            if (leave.bgimage) {
                img = leave.bgimage
            }
            if (leave.message) {
                msg = leave.message
            }

        } else if (leave.enable === false) {
            return res.redirect("/dashboard");
        }
    } else if (!leave) {
        return res.redirect("/dashboard");
    }
    console.log(img)
    console.log(msg)
    for (const value of x) {
        a.push(value)
    }

    res.render("leave-settings", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${req.user.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),
        req: req,
        bot: client,
        guild_channels: a,
        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
        img: img,
        message: msg,
    });
});

app.post("/:id/leavechannel/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await leavedb.findOneAndUpdate({ id: id }, { channel: data.channels });
    await res.redirect(`/guild/${req.params.id}/leave`);
})

app.post("/:id/leave/update", global.checkAuth, async (req, res) => {
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
        msg = '{mention} Left the {guild}!'
    } else {
        msg = data.msg
    }
    await leavedb.findOneAndUpdate({ id: id }, { bgimage: image })
    await leavedb.findOneAndUpdate({ id: id }, { message: msg })
    await res.redirect(`/guild/${req.params.id}/leave`);
})

module.exports = app;