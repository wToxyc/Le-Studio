import { Event } from '../Interfaces';

export const event: Event = {
    name: 'guildMemberAdd',
    once: false,
    run: (client, member) => {
        const channel = member.guild.channels.cache.get('1087110435678994543');
        channel.send(`» ${member} a rejoint le serveur !\nNous sommes maintenant \`${member.guild.memberCount}\` membres !\nPasse un bon séjour parmis nous 🤗 !`);
    }
}