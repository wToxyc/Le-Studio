import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Command } from "../../Interfaces";

export const command: Command = {
    name: 'clear',
    description: 'Supprime des messages dans le salon',
    category: 'Modération 🛡️',
    syntax: '<messages>',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    options: [{
        name: 'messages',
        description: 'Le nombre de message à supprimer',
        required: true,
        type: ApplicationCommandOptionType.Integer,
        minValue: 1,
        maxValue: 100
    }],
    run: async (client, interaction) => {
        const messages = interaction.options.get('messages').value;
        const { size } = await interaction.channel.bulkDelete(Number(messages));
        interaction.reply({
            fetchReply: true,
            content: `J'ai supprimé \`${size}\` message(s).`
        }).then((message) => {
            setTimeout(() => {
                message.delete().catch((err) => { });
            }, 3000);
        });
    }
}