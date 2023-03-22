import { Command, Event, Ticket } from '../Interfaces';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

const tickets = [];

export const event: Event = {
    name: 'interactionCreate',
    once: false,
    run: (client, interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            command.run(client, interaction);
        } else if (interaction.isButton()) {
            if (interaction.customId === 'ticket-create') {
                const filter = (ticket: Ticket) => ticket.user === interaction.user.id
                if (tickets.filter(filter).length > 0) return interaction.reply({
                    ephemeral: true,
                    content: 'Vous avez déjà un ticket ouvert !'
                });
                interaction.guild.channels.create({
                    name: `Ticket-${tickets.length + 1}`,
                    parent: '1087109722768945283',
                    permissionOverwrites: [{
                        id: interaction.guild.id,
                        deny: PermissionFlagsBits.ViewChannel
                    }, {
                        id: interaction.user.id,
                        allow: PermissionFlagsBits.ViewChannel
                    }, {
                        id: '1087115896583114803',
                        allow: PermissionFlagsBits.ViewChannel
                    }]
                }).then((channel) => {
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                })
                                .setTitle(`Ticket-${tickets.length + 1}`)
                                .setColor('Blurple')
                                .setDescription(`Bienvenue dans votre ticket, ${interaction.user},\nNous allons vous prendre en charge dès que possible.\nEn attendant, vous pouvez nous décrire votre problème le plus en détail possible.`)
                                .setFooter({ text: 'Merci de ne pas mentionner le staff !' })
                                .setTimestamp()
                        ],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('ticket-close')
                                        .setEmoji('🔒')
                                        .setLabel('Fermer le ticket')
                                        .setStyle(ButtonStyle.Danger)
                                )
                            ]
                    });
                    tickets.push({
                        user: interaction.user.id,
                        channel: channel.id
                    });
                    interaction.reply({
                        ephemeral: true,
                        content: `Votre ticket a été ouvert : ${channel}`
                    });
                });
            } else if (interaction.customId === 'ticket-close') {
                const filter = (ticket: Ticket) => ticket.channel === interaction.channel.id
                const ticket = tickets.find(filter);
                const index = tickets.indexOf(ticket);
                tickets.splice(index, 1);
                interaction.channel.delete();
            }
        } else if (interaction.isStringSelectMenu()) {
            interaction.deferUpdate();
            const category = interaction.values[0];
            const commandsList = new EmbedBuilder()
                .setTimestamp()
                .setTitle(category)
                .setColor('Blurple')
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setFooter({ text: 'Tapez /help <command> pour plus d\'informations !' });

            const filter = (command: Command) => command.category === category
            const commands = client.commands.filter(filter);
            commands.forEach((command) => {
                commandsList.addFields({
                    name: command.name,
                    value: command.description
                });
            });
            interaction.message.edit({ embeds: [commandsList] });
        }
    }
}