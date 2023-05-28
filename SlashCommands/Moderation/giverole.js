const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');

module.exports = {
    name: 'giverole',
    description: 'Will add role to member.',
    options: [
        {
            name: 'user',
            description: 'Mention user you want to give role.',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'role',
            description: 'Mention role you want to add.',
            required: true,
            type: ApplicationCommandOptionType.Role
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
             
            if (interaction.member.permissions.has('ManageRoles') || interaction.member.permissions.has("Administrator")) {
                const member = interaction.options.getUser("user");
                const user = interaction.guild.members.cache.get(member.id);
                const role = interaction.options.getRole("role")
                if (!user) return await interaction.editReply("Please provide a member to give role.")
                if (!role) return await interaction.editReply("Please provide a role to be given.")
                if (user.roles.cache.has(role.id)) return await interaction.editReply("Member already has that role.")


                user.roles.add(role.id)
                await interaction.editReply(`Added **${role.name}** to <@${user.id}> as requested by <@${interaction.member.user.id}>`)
            } else {
                return await interaction.editReply({ content: "Sorry! You don't have the required permission to use this command." });
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR')
                .setDescription(`ERROR IN GIVE-ROLE (SLASH) COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`Something went wrong! Here is error: ${err}`)
        }
    }
}
