const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: 'calculator',
    description: 'Advanced Calculator',
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {*} color
     */
    run: async (client, interaction, args, color) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
             
            const rows = [
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder({
                        customId: 'clear',
                        style: ButtonStyle.Danger,
                        label: "AC",
                    }),
                    new ButtonBuilder({
                        customId: '(',
                        style: ButtonStyle.Primary,
                        label: "(",
                    }),
                    new ButtonBuilder({
                        customId: ')',
                        style: ButtonStyle.Primary,
                        label: ")",
                    }),
                    new ButtonBuilder({
                        customId: '/',
                        style: ButtonStyle.Primary,
                        label: "➗",
                    })
                ]),
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder({
                        customId: '7',
                        style: ButtonStyle.Secondary,
                        label: "7",
                    }),
                    new ButtonBuilder({
                        customId: '8',
                        style: ButtonStyle.Secondary,
                        label: "8",
                    }),
                    new ButtonBuilder({
                        customId: '9',
                        style: ButtonStyle.Secondary,
                        label: "9",
                    }),
                    new ButtonBuilder({
                        customId: '*',
                        style: ButtonStyle.Primary,
                        label: "✖️",
                    })
                ]),
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder({
                        customId: '4',
                        style: ButtonStyle.Secondary,
                        label: "4",
                    }),
                    new ButtonBuilder({
                        customId: '5',
                        style: ButtonStyle.Secondary,
                        label: "5",
                    }),
                    new ButtonBuilder({
                        customId: '6',
                        style: ButtonStyle.Secondary,
                        label: "6",
                    }),
                    new ButtonBuilder({
                        customId: '-',
                        style: ButtonStyle.Primary,
                        label: "➖",
                    })
                ]),
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder({
                        customId: '1',
                        style: ButtonStyle.Secondary,
                        label: "1",
                    }),
                    new ButtonBuilder({
                        customId: '2',
                        style: ButtonStyle.Secondary,
                        label: "2",
                    }),
                    new ButtonBuilder({
                        customId: '3',
                        style: ButtonStyle.Secondary,
                        label: "3",
                    }),
                    new ButtonBuilder({
                        customId: '+',
                        style: ButtonStyle.Primary,
                        label: "➕",
                    })
                ]),
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder({
                        customId: 'backspace',
                        style: ButtonStyle.Primary,
                        label: "⬅️",
                    }),
                    new ButtonBuilder({
                        customId: '0',
                        style: ButtonStyle.Secondary,
                        label: "0",
                    }),
                    new ButtonBuilder({
                        customId: '.',
                        style: ButtonStyle.Primary,
                        label: "⚫",
                    }),
                    new ButtonBuilder({
                        customId: 'result',
                        style: ButtonStyle.Success,
                        label: "=",
                    })
                ]),
            ];
            let embed = new EmbedBuilder()
                .setDescription("```\nResults will be displayed here\n```")
                .setColor("Blue")
            const msg = await interaction.editReply({
                embeds: [embed],
                components: rows,

            });

            let data = "";
            const col = msg.createMessageComponentCollector({
                filter: i => i.user.id === interaction.member.user.id,
                time: 600000
            });

            col.on('collect', async (i) => {
                if (i.customId === "result") {
                    try {
                        data = math.evaluate(data).toString();
                    } catch (e) {
                        data = "An Error Occured, Please click on AC for restart"
                    }
                } else if (i.customId === "clear") {
                    data = "";
                } else if (i.customId === "backspace") {
                    data = data.slice(0, data.length - 2);
                } else {
                    const lc = data[data.length - 1];

                    data += `${(
                        (parseInt(i.customId) == i.customId || i.customId === ".")
                        &&
                        (lc == parseInt(lc) || lc === ".")
                    ) ? "" : " "}` + i.customId;
                }
                let me = new EmbedBuilder()
                    .setDescription(`\`\`\`\n${data}\n\`\`\``)
                    .setColor('Blue')
                await interaction.editReply({
                    embeds: [me]
                })
            })

            col.on('end', () => {
                interaction.editReply({
                    components: [new ActionRowBuilder().addComponents([
                        new ButtonBuilder({
                            label: "This Calculator Ended",
                            disabled: true,
                            style: ButtonStyle.Danger,
                            customId: "_1_"
                        })
                    ])]
                })
            })
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN CALCULATOR COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}