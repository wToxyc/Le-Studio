import { Client, Collection } from 'discord.js';
import mongoose from 'mongoose';
import { Command, Event, Config } from '../Interfaces';
import ConfigJson from '../config.json';
import { readdirSync } from 'fs';
import path from 'path';
import colors from 'colors';

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = ConfigJson;

    public async init() {
        this.login(this.config.token);
        await mongoose.connect(this.config.mongoURI).catch((err) => console.log(err));
        console.log('The database is now connected!');


        const eventPath = path.join(__dirname, '../Events/');
        readdirSync(eventPath).forEach((file) => {
            const { event } = require(`${eventPath}/${file}`);
            try {
                this.events.set(event.name, event);
            } catch (err) {
                console.log(`Failed to load ${file}!`.red);
            }
        });
        console.log(`Loaded ${this.events.size} event(s)!`);
        this.events.forEach((event) => {
            if (event.once) {
                this.once(event.name, (...args) => event.run(this, ...args));
            } else {
                this.on(event.name, (...args) => event.run(this, ...args));
            }
        });

        const commandPath = path.join(__dirname, '../Commands/');
        readdirSync(commandPath).forEach((subDir) => {
            const commands = readdirSync(`${commandPath}/${subDir}`);
            for (const file of commands) {
                const { command } = require(`${commandPath}/${subDir}/${file}`);
                try {
                    this.commands.set(command.name, command);
                } catch (err) {
                    console.log(`Failed to load ${file}!`.red);
                }
            }
        });
        console.log(`Loaded ${this.commands.size} command(s)!`);
    }
}

export default ExtendedClient;