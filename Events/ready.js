const Discord = require('discord.js');
const webhook = require("webhook-discord")
const { AutoPoster } = require('topgg-autoposter')
const bhbotlist = require("bhbotlist.js");
const fetch = require("node-fetch");
const Hook = new webhook.Webhook("https://discord.com/api/webhooks/1021769006274838599/6ZDbqrHZ2VU7lQbFlDx1SqbrFkke8_VZNS-lzi-FJ2s3a0GeTWjUjMszTFZpadjFBHOR")


module.exports = async (client) => {
    try {
        const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMTk2MTM5MzIyMTE2NzUyMzciLCJib3QiOnRydWUsImlhdCI6MTY4MDAyNjQ1OH0.50w_3BGhxv3yiiqMZlIvJNbsRKF24ZHWqLEaUFpKEkc', client)
        const dbl = new bhbotlist("N9OyFhHnTq1guaw8I7DcEJhMUIQnowAjFBR5gj6HAwoAmxeLNTKrxOJxJcb2fadvis6Tb9v34qg9FjuFl4sgLQfZKgeb9QfLOyArpp9K3XUE5nblgF9qZ2gMokSTH42I", client);
        client.user.setPresence({
            status: "online",
            activities: [
                {
                    name: `/help | ${client.guilds.cache.size}`,
                    type: Discord.ActivityType.Playing,

                },
            ]

        })
        dbl.serverCount().then(
            console.log("Posted stats to bhlist.co.in!")
        );
        ap.on('posted', () => {
            console.log('Posted stats to Top.gg!')
        })
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6IjEwMTk2MTM5MzIyMTE2NzUyMzciLCJpYXQiOjE2ODAwMjc1MzR9.zVJqwrQaeQF9Q3SehLRMPAKNe-DbqfqnsdboZpCHmRg");

        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("guilds", client.guilds.cache.size);
        urlencoded.append("users", client.users.cache.size);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://discordbotlist.com/api/v1/bots/1019613932211675237/stats", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        setInterval(() => {
            client.user.setPresence({
                status: "online",
                activities: [
                    {
                        name: `/help | ${client.guilds.cache.size}`,
                        type: Discord.ActivityType.Playing,

                    },
                ]

            })
            dbl.serverCount().then(
                console.log("Posted stats to bhlist.co.in!")
            );
            ap.on('posted', () => {
                console.log('Posted stats to Top.gg!')
            })
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6IjEwMTk2MTM5MzIyMTE2NzUyMzciLCJpYXQiOjE2ODAwMjc1MzR9.zVJqwrQaeQF9Q3SehLRMPAKNe-DbqfqnsdboZpCHmRg");

            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            var urlencoded = new URLSearchParams();
            urlencoded.append("guilds", client.guilds.cache.size);
            urlencoded.append("users", client.users.cache.size);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch("https://discordbotlist.com/api/v1/bots/1019613932211675237/stats", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }, 120000);

        const msg = new webhook.MessageBuilder()
            .setName('STARTUP LOGS')
            .setTitle('LOGS FOR STARTUP')
            .setDescription(`[API] Logged in as ${client.user.tag}.`)
            .setColor('#0099ff')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(`[API] Logged in as ${client.user.tag}.`);
    } catch (err) {
        return console.log(err)
    }
}
