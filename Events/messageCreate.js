const { EmbedBuilder } = require("discord.js");
//const pre= require("../Detabase/prefix.js");
const premiumScheme = require("../Detabase/premiumScheme.js");
const prefix = require("../Detabase/prefix.js")
const scheme = require("../Detabase/custom-commands.js")

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
    const data = await prefix.findOne({
        guildid: message.guild.id
    });
    if (!data) {
        let prefix = "c!"
        if (!message.guild || message.author.bot) return;

        const Mention = new RegExp(`^<@!?${client.user.id}> `);
        prefix = message.content.match(Mention) ? message.content.match(Mention)[0] : prefix;

        if (message.content.indexOf(prefix) !== 0) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        let color = client.config.Bot.Color;

        const cmd = client.commands.get(command) || client.commands.find((x) => x.aliases && x.aliases.includes(command));
        const datacustom = await scheme.findOne({ Guild: message.guild.id, Command: command })

        if (datacustom) return message.channel.send(datacustom.Response);
        try {
            if (cmd.premium) {
                const data = await premiumScheme.findOne({
                    Guild: message.guild.id
                })
                if (!data) return message.reply("This is a premium command.");

                if (!data.Permanent && Date.now() > data.Expire) {
                    data.delete();
                    return message.reply("This premium system is expired! :(")
                }
            }
        } catch (err) {
            return
        }



        if (!cmd) return;
        cmd.run(client, message, args, prefix);
    } else {
        let prefix = data.prefix;
        if (!message.guild || message.author.bot) return;

        const Mention = new RegExp(`^<@!?${client.user.id}> `);
        prefix = message.content.match(Mention) ? message.content.match(Mention)[0] : prefix;

        if (message.content.indexOf(prefix) !== 0) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        let color = client.config.Bot.Color;

        const cmd = client.commands.get(command) || client.commands.find((x) => x.aliases && x.aliases.includes(command));
        const datacustom = await scheme.findOne({ Guild: message.guild.id, Command: command })

        if (datacustom) return message.channel.send(datacustom.Response);
        if (cmd.premium) {
            const data = await premiumScheme.findOne({
                Guild: message.guild.id
            })
            if (!data) return message.reply("This is a premium command.");

            if (!data.Permanent && Date.now() > data.Expire) {
                data.delete();
                return message.reply("This premium system is expired! :(")
            }
        }
        if (!cmd) return;
        cmd.run(client, message, args, prefix);
    }

    //const ress =  await pre.findOne({Guild: message.guildId})

}
