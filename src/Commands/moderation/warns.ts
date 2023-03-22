import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../Interfaces";
import { User } from "../../Models/User";

export const command: Command = {
    name: 'warns',
    description: 'Affiche la liste des avertissements d\'un utilisateur',
    category: 'Modération 🛡️',
    syntax: '<user>',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    options: [{
        name: 'user',
        description: 'L\'utilisateur dont on veut afficher les avertissements',
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const userData = await User.findOne({ id: user.id });
        if (!await User.exists({ id: user.id }) || userData.warns.length == 0) return interaction.reply({
            ephemeral: true,
            content: 'Cet utilisateur n\'a pas d\'avertissement !'
        });
        const warnsList = new EmbedBuilder()
            .setTitle('Liste des warns')
            .setColor('Blurple')
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL()
            })
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(`Liste des avertissements de ${user}`);
        userData.warns.forEach((warn, index) => {
            const date = Math.floor(warn.date / 1000);
            warnsList.addFields({
                name: `Warn #${index + 1}`,
                value: `Raison : \`${warn.reason}\`\nModérateur : <@${warn.mod}>\nDate : <t:${date}> (<t:${date}:R>)`
            });
        });
        interaction.reply({ embeds: [warnsList] });
    }
}