import { PermissionFlagsBits } from 'discord.js';
import { Event } from '../Interfaces';
import { User } from '../Models/User';

const messagesSent = new Map();

setInterval(() => {
    messagesSent.clear();
}, 10000);

export const event: Event = {
    name: 'messageCreate',
    once: false,
    run: async (client, message) => {
        if (message.author.bot || !message.member) return;

        if (!await User.exists({ id: message.member.id })) {
            await new User({ id: message.member.id }).save();
        }
        const user = await User.findOne({ id: message.member.id });
        user.stats.messages++;

        if (message.channel.id === '1087112998281298091') {
            message.react('✅');
            message.react('❌');
        }

        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg/')) {
                message.delete();

                const censorship = '#!$£?&#%@';
                let censoredContent = message.content.replace('https://', censorship);
                censoredContent = censoredContent.replace('http://', censorship);
                censoredContent = censoredContent.replace('discord.gg/', censorship);
                message.channel.createWebhook({
                    name: message.author.username,
                    avatar: message.author.displayAvatarURL({ dynamic: true })
                }).then((webhook) => {
                    webhook.send(censoredContent).then(() => {
                        webhook.delete();
                    });
                });

                let warnContent = `Les liens sont interdit sur le serveur, ${message.member} !`;
                user.warns.push({
                    reason: 'Lien',
                    mod: client.user.id,
                    date: Date.now()
                });
                const filter = (warn) => warn.reason === 'Lien'
                const warns = user.warns.filter(filter);
                if (warns.length >= 3) {
                    message.member.timeout(60 ** 2 * 1000).catch((err) => { });
                    warnContent += '\nVous avez été exclu(e) du serveur pendant `1h`.';
                }
                message.channel.send(warnContent);
            }

            if (!messagesSent.has(message.member.id)) {
                messagesSent.set(message.member.id, { messages: [] });
            }
            const memberData = messagesSent.get(message.member.id);
            memberData.messages.push(message);
            if (memberData.messages.length >= 10) {
                memberData.messages.forEach((msg) => {
                    msg.delete().catch((err) => { });
                });
                memberData.messages = [];

                let warnContent = `Vous envoyez des messages trop rapidement, ${message.member} !`;
                user.warns.push({
                    reason: 'Spam',
                    mod: client.user.id,
                    date: Date.now()
                });
                const filter = (warn) => warn.reason === 'Spam'
                const warns = user.warns.filter(filter);
                if (warns.length >= 3) {
                    message.member.timeout(60 ** 2 * 1000).catch((err) => { });
                    warnContent += '\nVous avez été exclu(e) du serveur pendant `1h`.';
                }
                message.channel.send(warnContent);
            }
        }

        await user.save();
    }
}