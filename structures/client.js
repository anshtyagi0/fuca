const { Collection, EmbedBuilder, Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const webhook = require("webhook-discord")
const Hook = new webhook.Webhook("URL")


class Fuca extends Client {
  constructor(intents) {
    super(intents);

    this.commands = new Collection;
    this.slashCommands = new Collection;
    this.config = require("../config");//
    this.prefix = this.config.Bot.BotPrefix;
    mongoose.connect(this.config.Mongoose, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //useFindAndModify: false,
    }).then(() => {
      const msg = new webhook.MessageBuilder()
        .setName('STARTUP LOGS')
        .setTitle('LOGS FOR STARTUP')
        .setDescription(`DataBase Succesfully [ Connected ]`)
        .setColor('#0099ff')
        .setFooter(`Copyright © comsic`)
      Hook.send(msg)
      console.log(`DataBase Succesfully [ Connected ]`)
    })
  }

  start(token) {
    if (!token) return console.error(`You forgot to provide the token of the bot.`)
    this.login(token);
  }
}

module.exports = Fuca;
