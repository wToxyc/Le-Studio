import Client from './Client';

new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildVoiceStates', 'GuildPresences'],
    presence: { status: 'idle' },
    allowedMentions: { parse: ['users'] }
}).init();