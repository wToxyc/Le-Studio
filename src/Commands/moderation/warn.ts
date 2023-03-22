import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../Interfaces';
import { User } from '../../Models/User';

export const command: Command = {
    name: 'warn',
    description: 'Ajoute un avertissement un utilisateur',
    category: 'Modération 🛡️',
    syntax: '<user> <reason>',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    options: [{
        name: 'user',
        description: 'L\'utilisateur dont on veut ajouter un avertissement',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'reason',
        description: 'La raison de l\'avertissement',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.get('reason').value.toString();

        if (!await User.exists({ id: user.id })) {
            await new User({ id: user.id }).save();
        }
        const userData = await User.findOne({ id: user.id });
        userData.warns.push({
            reason: reason,
            mod: interaction.user.id,
            date: Date.now()
        });
        await userData.save();
        const date = Math.floor(Date.now() / 1000);
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Nouvel avertissement')
                    .setColor('Blurple')
                    .setDescription(`${user} a été averti`)
                    .setAuthor({
                        name: user.tag,
                        iconURL: user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .addFields({
                        name: 'Utilisateur',
                        value: `${user}`,
                        inline: true
                    }, {
                        name: 'Modérateur',
                        value: `${interaction.user}`,
                        inline: true
                    }, {
                        name: 'Raison',
                        value: reason
                    }, {
                        name: 'Date',
                        value: `<t:${date}> (<t:${date}:R>)`
                    })
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL()
                    })
            ]
        });
    }
}