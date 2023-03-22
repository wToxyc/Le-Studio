import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../Interfaces";
import { User } from "../../Models/User";

export const command: Command = {
    name: 'stats',
    description: 'Affiche les statistiques d\'un utilisateur',
    category: 'Utilitaires 🛠️',
    syntax: '[user]',
    options: [{
        name: 'user',
        description: 'L\'utilisateur dont on veut afficher les statistiques',
        type: ApplicationCommandOptionType.User
    }],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        if (!await User.exists({ id: user.id })) return interaction.reply({
            ephemeral: true,
            content: 'Cet utilisateur n\'a aucune statistique !'
        });
        const userStats = (await User.findOne({ id: user.id })).stats;
        const hours = Math.floor(userStats.voiceTime / 60);
        const minutes = userStats.voiceTime % 60;
        const voiceTime = `${hours}h${minutes}m`
        interaction.reply(`» __Statistiques de ${user}__ :\n💬〡Messages : \`${userStats.messages}\`\n🔊〡Activité vocale : \`${voiceTime}\``);
    }
}