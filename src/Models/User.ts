import { Schema, model } from 'mongoose';
import { IUser } from '../Interfaces'

const userSchema = new Schema<IUser>({
    id: { type: String, required: true },
    warns: [{
        reason: { type: String, required: true },
        mod: { type: String, required: true },
        date: { type: Number, required: true },
    }],
    stats: {
        messages: { type: Number, default: 0 },
        voiceTime: { type: Number, default: 0 },
    },
    // economy: {
    //     hand: { type: Number, default: 0 },
    //     bank: { type: Number, default: 100 },
    //     cooldowns: {
    //         work: { type: Number, default: null },
    //         slut: { type: Number, default: null },
    //         crime: { type: Number, default: null },
    //     }
    // }
});

export const User = model<IUser>('User', userSchema);