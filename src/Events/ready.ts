import { Event } from '../Interfaces';
import { User } from '../Models/User'
import { ActivityType, GuildMember } from 'discord.js';

export const event: Event = {
    name: 'ready',
    once: true,
    run: (client) => {
        console.log(`Logged in as ${client.user.tag}`);

        const guild = client.guilds.cache.get('1087016304415875144');
        const channel = guild.channels.cache.get('1087020976782442569');

        // const commands = client.commands.map((command) => command);
        // guild.commands.set(commands);

        setInterval(() => {
            client.user.setActivity(`${guild.memberCount} membres`, { type: ActivityType.Watching });
            channel.setName(`〡Membres : ${guild.memberCount}`);

            const filter = (member: GuildMember) => member.voice.channel && !member.user.bot;
            const membersInVoice = guild.members.cache.filter(filter);
            membersInVoice.forEach(async (member) => {
                if (!await User.exists({ id: member.id })) {
                    await new User({ id: member.id }).save();
                }
                const memberData = await User.findOne({ id: member.id });
                memberData.stats.voiceTime++;
                await memberData.save();
            });
        }, 5 * 1000);
    }
}