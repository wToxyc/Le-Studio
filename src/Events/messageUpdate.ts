import { PermissionFlagsBits } from 'discord.js';
import { Event } from '../Interfaces';
import { User } from '../Models/User';

export const event: Event = {
    name: 'messageUpdate',
    once: false,
    async run(client, oldMessage, newMessage) {
        if (newMessage.author.bot || !newMessage.member) return;

        if (newMessage.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            if (newMessage.content.includes('https://') || newMessage.content.includes('http://') || newMessage.content.includes('discord.gg/')) {
                newMessage.delete();
                const censorship = '#!$£?&#%@';
                let censoredContent = newMessage.content.replace('https://', censorship);
                censoredContent = censoredContent.replace('http://', censorship);
                censoredContent = censoredContent.replace('discord.gg/', censorship);
                newMessage.channel.createWebhook({
                    name: newMessage.author.username,
                    avatar: newMessage.author.displayAvatarURL({ dynamic: true })
                }).then((webhook) => {
                    webhook.send(censoredContent).then(() => {
                        webhook.delete();
                    });
                });

                let warnContent = `Les liens sont interdit sur le serveur, ${newMessage.member} !`;
                if (!await User.exists({ id: newMessage.member.id })) {
                    await new User({ id: newMessage.member.id }).save();
                }
                const user = await User.findOne({ id: newMessage.member.id });
                user.warns.push({
                    reason: 'Lien',
                    mod: client.user.id,
                    date: Date.now()
                });
                const filter = (warn) => warn.reason === 'Lien'
                const warns = user.warns.filter(filter);
                if (warns.length >= 3) {
                    newMessage.member.timeout(60 ** 2 * 1000).catch((err) => { });
                    warnContent += '\nVous avez été exclu(e) du serveur pendant `1h`.';
                }
                newMessage.channel.send(warnContent);
            }
        }
    }
}