const rrModel = require('../../Detabase/reactionroles.js');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');

module.exports = {
    name: 'add-role',
    description: 'add a custom reaction role.',
    category: 'reaction-roles',
    options: [
        {
            name: 'role',
            description: 'role to be assigned',
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: 'description',
            description: 'description of this role',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'emoji',
            description: 'emoji for the role',
            type: ApplicationCommandOptionType.String,
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
             
            if (interaction.member.permissions.has("ManageRoles") || interaction.member.permissions.has("Administrator")) {

                const role = interaction.options.getRole("role")
                let roleDescription = interaction.options.getString("description");
                if (!roleDescription) roleDescription = null;
                let roleEmoji = interaction.options.getString("emoji") || null;
                if (!roleEmoji) roleEmoji = null;
                if (role.position >= interaction.guild.members.me.roles.highest.position) return interaction.followUp("I can't assign a role that is higher or equal to me.");

                const guildData = await rrModel.findOne({ guildId: interaction.guildId })

                const newRole = {
                    roleId: role.id,
                    roleDescription,
                    roleEmoji,
                }

                if (guildData) {
                    let roleData = guildData.roles.find((x) => x.roleId === role.id)

                    if (roleData) {
                        roleData = newRole;
                    } else {
                        guildData.roles = [...guildData.roles, newRole]
                    }

                    await guildData.save();
                } else {
                    await rrModel.create({
                        guildId: interaction.guildId,
                        roles: newRole
                    })
                }

                await interaction.editReply(`Created a new role: ${role.name}`)
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN ADD-ROLE COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}