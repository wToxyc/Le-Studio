import { ActionRowBuilder, ApplicationCommandOptionType, EmbedBuilder, StringSelectMenuBuilder, } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'help',
    description: 'Affiche la liste des commandes ou les informations concernant une commande',
    category: 'Utilitaires 🛠️',
    syntax: '[command]',
    options: [{
        name: 'command',
        description: 'La commande dont on veut afficher les informations',
        type: ApplicationCommandOptionType.String
    }],
    run: (client, interaction) => {
        const command = interaction.options.get('command');
        if (!command) {
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select-category')
                .setPlaceholder('Sélectionnez la catégorie de votre choix');

            const categories = [];
            client.commands.forEach((cmd) => {
                if (!categories.includes(cmd.category)) {
                    categories.push(cmd.category);
                }
            });
            categories.forEach((category) => {
                selectMenu.addOptions({
                    label: category,
                    description: `Aide pour la catégorie ${category}`,
                    value: category
                });
            });
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Aide')
                        .setColor('Blurple')
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setDescription('Sélectionnez la catégorie de votre choix.')
                        .setFooter({
                            text: 'Tapez /help <command> pour plus d\'informations !'
                        })
                        .setTimestamp()
                ],
                components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)]
            });
        } else {
            if (!client.commands.has(command.value.toString())) return interaction.reply({
                ephemeral: true,
                content: 'Cette commande n\'existe pas !'
            });
            const commandData = client.commands.get(command.value.toString());
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(commandData.name)
                        .setColor('Blurple')
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                        .addFields({
                            name: 'Description',
                            value: `\`${commandData.description}\``
                        }, {
                            name: 'Catégorie',
                            value: `\`${commandData.category}\``
                        }, {
                            name: 'Syntaxe',
                            value: `\`${commandData.syntax}\``
                        }, {
                            name: 'Permission(s)',
                            value: `\`${commandData.defaultMemberPermissions ? String(commandData.defaultMemberPermissions) : 'Aucune'}\``
                        })
                ]
            });
        }
    }
}