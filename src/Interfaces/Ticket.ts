import { UserResolvable, ChannelResolvable } from "discord.js"

export interface Ticket {
    user: UserResolvable;
    channel: ChannelResolvable;
} []