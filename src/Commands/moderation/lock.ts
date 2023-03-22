import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'lock',
    description: 'Vérouille le salon',
    category: 'Modération 🛡️',
    syntax: 'Aucune',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    run: (client, interaction) => {
        if (interaction.channel.type === ChannelType.GuildText) {
            interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false
            });
        }
    }
}