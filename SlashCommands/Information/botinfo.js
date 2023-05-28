const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const { get } = require('request-promise-native');
const totalcommands = require("../../Detabase/commands.js")
module.exports = {
    name: 'botinfo',
    description: 'Will provide you all information about bot.',

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });
        try {
            dats = (await client.application.fetch()).owner
            let commands = await totalcommands.findOne({ client: `1019613932211675237` })
            const d = moment.duration(interaction.client.uptime);
            const days = (d.days() == 1) ? `${d.days()} day` : `${d.days()} days`;
            const hours = (d.hours() == 1) ? `${d.hours()} hour` : `${d.hours()} hours`;
            const clientStats = stripIndent`
                Servers   :: ${interaction.client.guilds.cache.size}
                Users     :: ${interaction.client.users.cache.size}
                Channels  :: ${interaction.client.channels.cache.size}
                WS Ping   :: ${Math.round(interaction.client.ws.ping)}ms
                Uptime    :: ${days} and ${hours}
                Prefix    :: ${prefix} or /
             `;
            const { totalMemMb, usedMemMb } = await mem.info();
            const serverStats = stripIndent`
                OS        :: ${await os.oos()}
                Cores     :: ${cpu.count()}
                CPU Usage :: ${await cpu.usage()} %
                RAM       :: ${totalMemMb} MB
                RAM Usage :: ${usedMemMb} MB
              `;
            const embed = new EmbedBuilder()
                .setTitle('Bot\'s Statistics')
                .addFields(
                    { name: 'Owner', value: '<@671390595184459782> || {Ansh}#0607' },
                    { name: 'Bot Version', value: `1.1.9` },
                    { name: 'Commands', value: `\` ${commands.number}\`` },
                    { name: 'Client', value: `\`\`\`asciidoc\n${clientStats}\`\`\`` },
                    { name: 'Server', value: `\`\`\`asciidoc\n${serverStats}\`\`\`` },
                    // { name: 'Shards', value: interaction.client.shard.ids },
                    { name: "Terms of Use", value: '[CLICK ME](https://fuca.fluiddev.xyz/termsofuse)' },
                    { name: "Privacy Policy", value: '[CLICK ME](https://fuca.fluiddev.xyz/privacypolicy)' },
                    { name: "Website", value: '[CLICK ME](https://fuca.fluiddev.xyz/)' }
                )
                .setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setColor('Blurple');
            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN BOTINFO (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
        }
    }
}