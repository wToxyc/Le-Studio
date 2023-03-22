import { Event } from '../Interfaces';

export const event: Event = {
    name: 'guildMemberRemove',
    once: false,
    run: (client, member) => {
        const channel = member.guild.channels.cache.get('1087110435678994543');
        channel.send(`» ${member} a quitté le serveur...\nNous ne sommes plus que \`${member.guild.memberCount}\` membres...\nOn espère te revoir bientôt 🥲 !`);
    }
}