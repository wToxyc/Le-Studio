import { Command } from "../../Interfaces";

export const command: Command = {
    name: 'ping',
    description: 'Affiche la latence du bot et de l\'API',
    category:  'Utilitaires 🛠️',
    syntax: 'Aucune',
    run: (client, interaction) => {
        interaction.reply({
            fetchReply: true,
            content: 'Calcul en cours...'
        }).then((message) => {
            const latency = message.createdTimestamp - interaction.createdTimestamp;
            const APILatency = client.ws.ping;
            message.edit(`Latence : \`${latency}ms\`\nLatence de l'API : \`${APILatency}ms\``);
        });
    }
}