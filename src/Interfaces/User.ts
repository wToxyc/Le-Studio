export interface IUser {
    id: string;
    warns: {
        reason: string;
        mod: string;
        date: number;
    } [],
    stats: {
        messages: number;
        voiceTime: number;
    },
    economy: {
        hand: number,
        bank: number,
        cooldowns: {
            work: number;
            slut: number;
            crime: number;
        }
    }
}