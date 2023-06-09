import Client from '../Client';
import { ClientEvents } from 'discord.js';

interface Run {
    (client: Client, ...args: any[])
}

export interface Event {
    name: keyof ClientEvents;
    once: boolean;
    run: Run;
}