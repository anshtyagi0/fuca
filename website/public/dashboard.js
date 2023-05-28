const app = require('express').Router();
const client = require('../../index.js')
console.log("[Fuca]: Home router loaded.");

app.get("/dashboard", global.checkAuth, async (req, res) => {
    await client.users.cache.get(req.user.id);
    let myGuilds = req.user.guilds.filter(e => e.permissions === 2147483647);

    res.render("dashboard.ejs", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${req.user.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: client,

        guilds: myGuilds,
    });
});


module.exports = app;