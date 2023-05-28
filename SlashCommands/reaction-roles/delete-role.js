const rrModel = require('../../Detabase/reactionroles.js');
const usersdata = require("../../Detabase/term.js")
const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageCollector, ApplicationCommandOptionType, ButtonStyle  } = require('discord.js');

module.exports = {
    name: 'delete-role',
    description: 'remove a custom reaction role.',
    options: [
        {
            name: 'role',
            description: 'role to be removed',
            type: ApplicationCommandOptionType.Role,
            required: true
        },
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

                if (role.position >= interaction.guild.members.me.roles.highest.position) return interaction.followUp("I can't assign a role that is higher or equal to me.");

                const guildData = await rrModel.findOne({ guildId: interaction.guildId })

                if (!guildData) return interaction.followUp(" There is no roles inside of this server.")

                const guildRole = guildData.roles;

                const findRole = guildRole.find(x => x.roleId === role.id)

                if (!findRole) return interaction.followUp("That role is not added to reaction role list.")

                const filteredRoles = guildRole.filter(x => x.roleId !== role.id)
                guildData.roles = filteredRoles;

                await guildData.save();

                await interaction.editReply(`Removed ${role.name} from reactionroles.`);
            } else {
                return await interaction.editReply("You don't have permissions to use it.")
            }
        } catch (err) {
            const webhook = require("webhook-discord")
            const Hook = new webhook.Webhook("https://discord.com/api/webhooks/973259740228501514/1dJPhLSaqMzLPzlrnn_MYu4I0e1vAhjUqWFJOgfrcO1h_XeqL1U9WgxMxF2YL46UL6gI")


            const msg = new webhook.MessageBuilder()
                .setName('ERROR LOGS')
                .setTitle('ERROR (SLASH)')
                .setDescription(`ERROR IN DELETE-ROLE COMMAND.\n${err}`)
                .setColor('#000')
                .setFooter(`Copyright © Fuca`)
            Hook.send(msg)
            console.log(err)
            await interaction.editReply(`something went wrong: ${err}`)
        }
    }
}