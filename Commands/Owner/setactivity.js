const Discord = require('discord.js');

module.exports = {
    name: "setactivity",
    aliases: ['seta'],
    description:"Will change bot's activity",
    category: "Owner",
    example: ["ping"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */

    run: async(client, message,args) => {
        let activitytype = args.slice(0,1).toString()
        if(activitytype==="streaming" || activitytype==="STREAMING") return await message.channel.send("You have not allowed me to set it to streaming mode.")
        if (!activitytype) return await message.reply("Correct way to use: setactivity PLAYING c!help")
        try {
            let activitytypeu=activitytype.toUpperCase()
            let nam = args.slice(1).join(' ').toString()
            if(message.author.id==='671390595184459782') {
                try {
                    client.user.setPresence({
                        status: "online",
                        activities: [
                            {
                                name: nam,
                                type: activitytypeu,
    
                            },
                        ]
                    
                    });
                    await message.reply("Set activity!")
                } catch (err) {
                    await message.reply(`Something went wrong! Here is error:\n${err}`)
                }
            

            }
        } catch (err){
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN SETACTIVITY COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            message.reply(`Something went wrong! Here is error: ${err}`)
        }
    }

}