const { Client } = require("discord.js");
const fs = require("fs");
const webhook = require("webhook-discord")
let db = require("../Detabase/commands.js")
const Hook = new webhook.Webhook("https://discord.com/api/webhooks/1021769006274838599/6ZDbqrHZ2VU7lQbFlDx1SqbrFkke8_VZNS-lzi-FJ2s3a0GeTWjUjMszTFZpadjFBHOR")


/**
 * @param {Client} client
 */

module.exports = async (client) => {


    const data = [];
    let totals = 0
    fs.readdirSync("./SlashCommands/").forEach((dir) => {
        const slashCommandFile = fs.readdirSync(`./SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"));

        for (const file of slashCommandFile) {
            const slashCommand = require(`../SlashCommands/${dir}/${file}`);

            if (!slashCommand.name) return console.error(`SlashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if (!slashCommand.description) return console.error(`SlashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.name, slashCommand);
            console.log(`Client SlashCommands Command (/) Loaded: ${slashCommand.name}`);
            totals = totals + 1
            data.push(slashCommand);
        }
    });

    client.on("ready", async () => {
        await db.findOneAndUpdate({ client: '1019613932211675237' }, { number: (totals).toString() }) || await db.create({ client: '1019613932211675237', number: (totals).toString() })
        await client.application.commands?.set(data).then(() => {
            const msg = new webhook.MessageBuilder()
                .setName('STARTUP LOGS')
                .setTitle('LOGS FOR STARTUP')
                .setDescription(`Client SlashCommand (/) Registered.`)
                .setColor('#0099ff')
                .setFooter(`Copyright © comsic`)
            Hook.send(msg)
            console.log(`Client SlashCommand (/) Registered.`)
        }).catch((e) => console.log(e));
    });
}
