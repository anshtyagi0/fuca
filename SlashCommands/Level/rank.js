const usersdata = require("../../Detabase/term.js")
const userxp = require("../../Detabase/user_xp.js")
const guilddata = require("../../Detabase/guildConfig.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require("canvas");

module.exports = {
    name: 'rank',
    description: 'Will tell level of user.',
    options: [
        {
            name: 'user',
            description: 'Will tell level of a user.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            const user = interaction.options.getUser("user") || interaction.member.user
            let datas = await userxp.find({ guild: interaction.guild.id }) || {}, data, rank;
            let guilddb = await guilddata.findOne({ id: interaction.guild.id })
            console.log(guilddb.bgrank)

            for (let i = 0; i < datas.length; i++) {
                let v = datas[i];

                if (v.user === user.id) {
                    data = v;
                    rank = i + 1;
                    break;
                }
            };

            if (!data) return interaction.editReply("you have no xp & data")

            let reqXP = 100;

            for (let i = 1; i <= data.level; i++)reqXP += 5 * (i ^ 2) + (50 * i) + 100;

            const canvas = createCanvas(1000, 300),
                ctx = canvas.getContext('2d'),
                bar_width = 600,
                bg = await loadImage(guilddb.bgrank),
                av = await loadImage(user.displayAvatarURL({ extension: 'png', dynamic: false }));

            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            // Middle circle for Avatar Background
            ctx.beginPath();
            ctx.arc(120, 120, 110, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();

            // XP Bar
            ctx.lineJoin = "round";
            ctx.lineWidth = 69;

            // Shadow of xp bar
            ctx.strokeRect(298, 199, bar_width, 2);

            // Empty Bar
            ctx.strokeStyle = "black";
            ctx.strokeRect(300, 200, bar_width, 0);

            // Filled Bar
            ctx.strokeStyle = "#1762e8"
            ctx.strokeRect(300, 200, bar_width * data.xp / reqXP, 0);

            // Adding Username
            ctx.font = "bold 40px Sans";
            ctx.fillStyle = "#fe5701"; // Username color
            ctx.textAlign = "center";
            ctx.fillText(user.username, 120, 275, 200);

            // Adding stats
            ctx.fillText("#" + rank, 760, 40, 80);
            ctx.fillText(data.level, 930, 40, 80);

            // Adding titles
            ctx.fillStyle = "white";
            ctx.font = "bold 25px Sans";
            ctx.fillText("Rank", 680, 40, 200);
            ctx.fillText("Level", 850, 40, 200);

            // Adding bar title
            ctx.fillStyle = "#white";
            ctx.font = "bold 22px Serif";
            ctx.fillText(`${data.xp}/${reqXP} XP`, 850, 150);
            ctx.fillText(`${((data.xp * 100) / reqXP).toFixed(0)}/100 %`, 350, 150);

            // Remove the corners
            ctx.beginPath();
            ctx.arc(120, 120, 110, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();

            // Add the avatar
            ctx.drawImage(av, 10, 10, 220, 200);

            const at = new AttachmentBuilder(canvas.toBuffer(), { name: "rank.png" });
            interaction.editReply({
                files: [at]
            })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("url")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN RANK (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
