const Discord = require('discord.js');
const webhook = require("webhook-discord")
const Hook = new webhook.Webhook("https://discord.com/api/webhooks/1021769006274838599/6ZDbqrHZ2VU7lQbFlDx1SqbrFkke8_VZNS-lzi-FJ2s3a0GeTWjUjMszTFZpadjFBHOR")

module.exports = async (client, guild) => {
    if (!guild.available) return;
    const msg = new webhook.MessageBuilder()
        .setName("Guild Left")
        .setAvatar("https://cdn.discordapp.com/avatars/931885941512106034/8f2e00dcbd1d636a1e60d92fc932f991.webp?size=1024")
        .setColor("#000")
        .setTitle("Guild Left")
        .setDescription(`Left guild \n Guild name: ${guild.name}\n Guild id: ${guild.id}`)
        .setThumbnail((guild.iconURL({dynamic:true})))
    
    Hook.send(msg)
}