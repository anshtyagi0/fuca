const app = require('express').Router();
const client = require('../../index.js')
const youtubedb = require("../../Detabase/youtube.js")
const fetch = require('node-fetch');
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

app.get("/:id/youtube", global.checkAuth, async (req, res) => {

    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }
    let guild = client.guilds.cache.get(req.params.id);
    let x = guild.channels.cache.filter(e => e.type === ChannelType.GuildText)
    let a = [];

    for (const value of x) {
        a.push(value)
    }
    let link = 'NONE';
    let data = await youtubedb.findOne({ guild: req.params.id })
    if (data) {
        link = data.youtubechannel
    }


    res.render("youtube.ejs", {
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
        link: link,
    });
});

app.post("/:id/youtubechannel/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    let db = await youtubedb.findOne({ guild: id })
    if (db) {
        await youtubedb.findOneAndUpdate({ guild: id }, { discordchannel: data.channels });
    } else if (!db) {
        await youtubedb.create({
            guild: id,
            discordchannel: data.channels
        })
    }
    await res.redirect(`/guild/${req.params.id}/youtube`);
})

app.post("/:id/youtube/update", global.checkAuth, async (req, res) => {
    let gui = client.guilds.cache.get(req.params.id);
    let inGuild = client.guilds.cache.get(req.params.id).members.cache.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permissions.has("MANAGE_GUILD");

    if (!(req.params.id || inGuild || gui || hasPermission)) {
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    let db = await youtubedb.findOne({ guild: id })
    let youtubechannel = data.link
    async function channelid(url) {
        if (url.includes('@')) {
            const channel = url.split('/').pop();
            const response = await fetch(`https://yt.lemnoslife.com/channels?handle=${channel}`)
            const data = await response.json()
            return data.items[0].id
        } else if (url.includes('channel')) {
            const id = url.split('/').pop();
            return id
        } else if (url.includes('/c/')) {
            const channel = url.split('/').pop();
            const response = await fetch(`https://yt.lemnoslife.com/channels?handle=@${channel}`)
            const data = await response.json()
            return data.items[0].id
        } else {
            return 'wrong url'
        }
    }
    let iddata = await channelid(youtubechannel)
    if (iddata === 'null' || iddata === 'Null' || iddata === 'wrong url') {
        return res.redirect('/500')
    }
    if (db) {
        await youtubedb.findOneAndUpdate({ guild: id }, { youtubechannel: iddata })
    } else if (!db) {
        return res.redirect('/500')
    }
    await res.redirect(`/guild/${req.params.id}/youtube`);
})

module.exports = app;