const app = require('express').Router();
const client = require('../../index.js')
const commandsdb = require("../../Detabase/commands.js")
const fs = require("fs");
console.log("[Fuca]: Home router loaded.");

app.get("/", async (req, res) => {
    let db = await commandsdb.findOne({ client: '1019613932211675237' })
    let args = {
        server: client.guilds.cache.size,
        users: client.users.cache.size,
        user: req.isAuthenticated() ? req.user : null,
        command: db.number || 0,
    }
    res.render("home.ejs", args)
})

app.get("/invite", async (req, res) => {
    return res.redirect("https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Ffuca.fluiddev.xyz&permissions=1099511627775&client_id=1019613932211675237&scope=bot%20applications.commands")
})

app.get("/discord", async (req, res) => {
    return res.redirect("https://discord.gg/v8YSWmF88v")
})

app.get("/github", async (req, res) => {
    return res.redirect("https://github.com/anshtyagi0/Fucadocs")
})

app.get("/termsofuse", async (req, res) => {
    res.render('termsofuse.ejs')
})

app.get("/privacypolicy", async (req, res) => {
    res.render('privacypolicy.ejs')
})


app.get('/commands', (req, res) => {
    let commandsname = [];
    let commandsdescription = {};
    fs.readdirSync("/home/ansh/SlashCommands/").forEach((dir) => {
        const slashCommandFile = fs.readdirSync(`/home/ansh/SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
        let slashCommand;
        for (const file of slashCommandFile) {
            slashCommand = require(`/home/ansh/SlashCommands/${dir}/${file}`);

            if (!slashCommand.name) return console.error(`SlashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if (!slashCommand.description) return console.error(`SlashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);
            commandsname.push(slashCommand.name);
            commandsdescription[slashCommand.name] = slashCommand.description
        }
    });
    let args = {
        server: client.guilds.cache.size,
        users: client.users.cache.size,
        user: req.isAuthenticated() ? req.user : null,
        commandsname: commandsname,
        commandsdescription: commandsdescription,
    }
    res.render('commands.ejs', args);
});

module.exports = app;