import Client from '../Client';
import { CommandInteraction, ChatInputApplicationCommandData } from 'discord.js';

interface Run {
    (client: Client, interaction: CommandInteraction): void;
}

export interface Command extends ChatInputApplicationCommandData {
    category: string;
    syntax: string;
    run: Run;
}