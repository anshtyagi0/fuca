const Discord = require('discord.js');
const axios = require("axios");
const mongoose = require("mongoose")
const youdatabase = require("../Detabase/youtube.js")

module.exports = async (client) => {
    try {
        const createyoutubelist = async () => {
            let youtubechannelids = []
            let x = await youdatabase.find()
            for (let i = 0; i < x.length; i++) {
                if (!youtubechannelids.includes(x[i].youtubechannel)) {
                    youtubechannelids.push(x[i].youtubechannel)
                } else if (youtubechannelids.includes(x[i].youtubechannel)) {
                    console.log("Already in list.")

                }
            }
            return youtubechannelids
        }

        const createchannellist = async (youtubechannel) => {
            let channelids = []
            let x = await youdatabase.find({
                youtubechannel: youtubechannel
            })
            for (let i = 0; i < x.length; i++) {
                channelids.push(x[i].discordchannel)
            }
            return channelids
        }

        const createEmbed = async (videoTitle, videoUrl, imgurl, channelname, channelid, desc, videoDate, live) => {
            const response = await axios.get(`https://fucaytapi.fluiddev.xyz/YouTube-operational-API/noKey/channels?part=snippet&id=${channelid}`);
            const channel = response.data.items[0];
            if (live === "none") {
                const embed = new Discord.EmbedBuilder()
                    .setAuthor({ name: `${channelname}`, iconURL: channel.snippet.thumbnails.high.url, url: `https://www.youtube.com/c/${channelid}` })
                    .setThumbnail(channel.snippet.thumbnails.high.url)
                    .setTitle(videoTitle)
                    .setURL(videoUrl)
                    .setImage(imgurl)
                    .setDescription(`${channelname} just uploaded a video!`)
                    .addFields(
                        { name: "Description", value: `${desc || 'NONE'}` }
                    )
                    .setFooter({ text: 'YouTube video', iconURL: `https://cdn.discordapp.com/attachments/973268227314573312/1072418125955469312/youtube-footer.png` })
                    .setTimestamp(videoDate)
                    .setColor("#00ff00")
                return embed
            } else if (live === 'live') {
                const embed = new Discord.EmbedBuilder()
                    .setAuthor({ name: `${channelname}`, iconURL: channel.snippet.thumbnails.high.url, url: `https://www.youtube.com/c/${channelid}` })
                    .setThumbnail(channel.snippet.thumbnails.high.url)
                    .setTitle(videoTitle)
                    .setURL(videoUrl)
                    .setImage(imgurl)
                    .setDescription(`${channelname} is live!`)
                    .addFields(
                        { name: "Description", value: `${desc || 'NONE'}` }
                    )
                    .setFooter({ text: 'YouTube Live', iconURL: `https://cdn.discordapp.com/attachments/973268227314573312/1072418125955469312/youtube-footer.png` })
                    .setTimestamp(videoDate)
                    .setColor("#00ff00")
                return embed
            }
        }

        const videoSchema = new mongoose.Schema({
            videoID: String,
            videoTitle: String,
            videoURL: String,
            videoDate: Date,
            channel: String,
        });
        const Video = mongoose.model("Video", videoSchema);

        const getRecentUploads = async (channelID) => {
            const apiURL = `https://fucaytapi.fluiddev.xyz/YouTube-operational-API/noKey/search?part=snippet&channelId=${channelID}&maxResults=1&order=date&type=video`;
            try {
                const response = await axios.get(apiURL);
                return response.data.items;
            } catch (error) {
                console.error(error);
            }
        };

        const videoExists = async (videoID) => {
            const video = await Video.findOne({ videoID: videoID });
            return video !== null;
        };

        // Save the video information to the MongoDB database
        const saveVideo = async (videoID, videoTitle, videoURL, videoDate, channelID) => {
            const newVideo = new Video({
                videoID: videoID,
                videoTitle: videoTitle,
                videoURL: videoURL,
                videoDate: videoDate,
                channel: channelID
            });
            try {
                await newVideo.save();
            } catch (error) {
                console.error(error);
            }
        };

        // Send the embed
        const sendchannel = async (client, channellist, embed) => {
            channellist = channellist[0]
            for (let i = 0; i < channellist.length; i++) {
                let channel = client.channels.cache.get(channellist[i]);
                try {
                    await channel.send({ embeds: [embed] })
                } catch (err) {
                    console.log("Issue with channel.")
                }


            }

        };

        const main = async () => {
            let YOUTUBE_CHANNEL_ID = [await createyoutubelist()]
            YOUTUBE_CHANNEL_ID = YOUTUBE_CHANNEL_ID[0]
            for (let i = 0; i < YOUTUBE_CHANNEL_ID.length; i++) {
                const channelID = YOUTUBE_CHANNEL_ID[i];
                const recentUploads = await getRecentUploads(channelID);
                if (recentUploads.length > 0) {
                    const videoID = recentUploads[0].id.videoId;
                    const videoTitle = recentUploads[0].snippet.title;
                    const thumbnails = recentUploads[0].snippet.thumbnails.high.url
                    const videoURL = `https://www.youtube.com/watch?v=${videoID}`;
                    const channelname = recentUploads[0].snippet.channelTitle;
                    const desc = recentUploads[0].snippet.description
                    const channelidd = recentUploads[0].snippet.channelId
                    const videoDate = new Date(recentUploads[0].snippet.publishedAt)
                    const live = recentUploads[0].snippet.liveBroadcastContent
                    if (await videoExists(videoID) == false) {
                        saveVideo(videoID, videoTitle, videoURL, videoDate, channelID);
                        const embed = await createEmbed(videoTitle, videoURL, thumbnails, channelname, channelidd, desc, videoDate, live);
                        let channellist = [await createchannellist(YOUTUBE_CHANNEL_ID[i])]
                        sendchannel(client, channellist, embed)
                    } else if (await videoExists(videoID) == true) {
                        return console.log("Video Already their")
                    } else {
                        console.log("Something wrong.")
                    }
                }
            }
        };
        setInterval(main, 300000)
    } catch (err) {
        const webhook = require("webhook-discord")
        const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


        const msg = new webhook.MessageBuilder()
            .setName('ERROR LOGS')
            .setTitle('ERROR (EVENT)')
            .setDescription(`ERROR IN READY 2 EVENT.\n${err}`)
            .setColor('#000')
            .setFooter(`Copyright © Fuca`)
        Hook.send(msg)
        console.log(err)
    }
}
