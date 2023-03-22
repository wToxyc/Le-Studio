import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Command } from "../../Interfaces";
import { User } from "../../Models/User";

export const command: Command = {
    name: 'unwarn',
    description: 'Retire un avertissement à un utilisateur',
    category: 'Modération 🛡️',
    syntax: '<user> <warn>',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    options: [{
        name: 'user',
        description: 'L\'utilisateur dont on veut retirer un avertissement',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'warn',
        description: 'L\'avertissement à retirer',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        minValue: 1
    }],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const warn = Number(interaction.options.get('warn').value) - 1;

        const userData = await User.findOne({ id: user.id });
        if (!await User.exists({ id: user.id }) || userData.warns.length == 0) return interaction.reply({
            ephemeral: true,
            content: `${user} n'a aucun avertissement !`
        });
        if (!userData.warns[warn]) return interaction.reply({
            ephemeral: true,
            content: 'Cet avertissement n\'existe pas !'
        });
        userData.warns.splice(warn, 1);
        await userData.save();
        interaction.reply(`L'avertissement \`#${warn + 1}\` de ${user} a été retiré.`);
    }
}