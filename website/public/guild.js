const app = require('express').Router();
const client = require('../../index.js')
const leavedb = require("../../Detabase/leave.js")
const welcomedb = require("../../Detabase/welcome.js")
const level = require("../../Detabase/guildConfig.js");
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

app.get("/:id", global.checkAuth, async (req, res) => {

    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    res.render("guild", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${req.user.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,
        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
    });
});

app.get("/:id/settings", global.checkAuth, async (req, res) => {

    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }
    const leveling = await level.findOne({ id: req.params.id }) || await level.create({ id: req.params.id });
    let xp = true
    if (leveling) {
        if (leveling.xpLevelUP.enable === true) {
            xp = true
        } else if (leveling.xpLevelUP.enable === false) {
            xp = false
        }
    } else if (!leveling) {
        xp = false
    }

    let y = leveling.ignoreXP
    let guild = client.guilds.cache.get(req.params.id);
    let x = guild.channels.cache.filter(e => e.type === ChannelType.GuildText)
    let a = [];
    const leave = await leavedb.findOne({ id: req.params.id }) || await leavedb.create({ id: req.params.id });
    let le = true
    if (leave) {
        if (leave.enable === true) {
            le = true
        } else if (leave.enable === false) {
            le = false
        }
    } else if (!leave) {
        le = false
    }
    const mes = await level.findOne({ id: req.params.id })
    let messagelog = false
    let memberlog = false
    let channellog = false
    let logs = false
    if (mes) {
        if (mes.logs === true) {
            logs = true
        } else if (mes.logs === false) {
            logs = false
        }
        if (mes.messagelog === true) {
            messagelog = true
        } else if (mes.messagelog === false) {
            messagelog = false
        }
        if (mes.channellog === true) {
            channellog = true
        } else if (mes.channellog === false) {
            channellog = false
        }
        if (mes.memberlog === true) {
            memberlog = true
        } else if (mes.memberlog === false) {
            memberlog = false
        }
    }
    const welcome = await welcomedb.findOne({ id: req.params.id }) || await welcomedb.create({ id: req.params.id });
    let we = true
    if (welcome) {
        if (welcome.enable === true) {
            we = true
        } else if (welcome.enable === false) {
            we = false
        }
    } else if (!welcome) {
        we = false
    }

    for (const value of x) {
        if (!y.includes(value.id)) {
            a.push(value)
        }
    }


    res.render("settings", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${req.user.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),
        we: we,
        req: req,
        bot: client,
        le: le,
        guild_channels: a,
        guild_channels_ignored: y,
        xp: xp,
        messagelog: messagelog,
        memberlog: memberlog,
        channellog: channellog,
        logs: logs,
        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
    });
});

app.post("/:id/modules/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let welcomes = data["welcome-module"] ? true : false;
    let leaves = data["leave-module"] ? true : false;
    let xp = data["xp-module"] ? true : false;
    let logs = data["logs-module"] ? true : false;

    let id = req.params.id;

    const leave = await leavedb.findOne({ id: req.params.id }) || await leavedb.create({ id: req.params.id });
    const welcome = await welcomedb.findOne({ id: req.params.id }) || await welcomedb.create({ id: req.params.id });
    const leveling = await level.findOne({ id: req.params.id }) || await level.create({ id: req.params.id });


    if (welcomes) {
        await welcomedb.findOneAndUpdate({ id: id }, { enable: true });
    } else if (!welcomes) {
        await welcomedb.findOneAndUpdate({ id: id }, { enable: false });
    }

    if (leaves) {
        await leavedb.findOneAndUpdate({ id: id }, { enable: true });
    } else if (!leaves) {
        await leavedb.findOneAndUpdate({ id: id }, { enable: false });
    }

    if (xp) {
        await level.findOneAndUpdate({ id: id }, { $set: { "xpLevelUP.enable": true } });
    } else if (!xp) {
        await level.findOneAndUpdate({ id: id }, { $set: { "xpLevelUP.enable": false } });
    }

    if (logs) {
        await level.findOneAndUpdate({ id: id }, { $set: { "logs": true } });
    } else if (!logs) {
        await level.findOneAndUpdate({ id: id }, { $set: { "logs": false } });
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

app.post("/:id/logs/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    console.log(data)
    let message = data["message-log"] ? true : false;
    let channel = data["channel-log"] ? true : false;
    let member = data["member-log"] ? true : false;
    let id = req.params.id;


    if (message) {
        await level.findOneAndUpdate({ id: id }, { $set: { "messagelog": true } });
    } else if (!message) {
        await level.findOneAndUpdate({ id: id }, { $set: { "messagelog": false } });
    }

    if (member) {
        await level.findOneAndUpdate({ id: id }, { $set: { "memberlog": true } });
    } else if (!member) {
        await level.findOneAndUpdate({ id: id }, { $set: { "memberlog": false } });
    }

    if (channel) {
        await level.findOneAndUpdate({ id: id }, { $set: { "channellog": true } });
    } else if (!channel) {
        await level.findOneAndUpdate({ id: id }, { $set: { "channellog": false } });
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

app.post("/:id/ignored-channels/update", async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;

    let leveldb = await level.findOne({ id: req.params.id }) || await level.create({ id: req.params.id });

    if (typeof data.channels === "string") {
        let array = leveldb.ignoreXP;
        array.push(data.channels)
        let fixed = remove_duplicates(array);
        await level.findOneAndUpdate({ id: id }, { $set: { "ignoreXP": fixed } });
    } else {
        for (const value of data.channels) {
            let array = leveldb.ignoreXP;
            array.push(value)
            let fixed = remove_duplicates(array);
            await guild.findOneAndUpdate({ id: id }, { $set: { "ignoreXP": fixed } });
        }
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

app.post("/:id/logchannel/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    await level.findOneAndUpdate({ id: id }, { logschannel: data.channelslog });
    await res.redirect(`/guild/${req.params.id}/settings`);
})

app.post("/:id/ignored-channel/delete", async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;

    let leveldb = await level.findOne({ id: id });

    if (data.channel) {
        await level.findOneAndUpdate({ id: id }, { $pull: { "ignoreXP": data.channel } });
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

module.exports = app;