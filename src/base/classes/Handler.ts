import IHandler from "../interfaces/IHandler";
import {glob} from "glob";
import CustomClient from "./CustomClient";
import Event from "./Event";
import * as path from "node:path";
import * as console from "node:console";
import SubCommand from "./SubCommand";
import Command from "./Command";
import {ClientEvents} from "discord.js";

/**
 * Handles loading of events and commands.
 * @implements {IHandler}
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Handler implements IHandler {

    /** The {@link CustomClient} instance to handle events and commands for.
     * @type CustomClient
     */
    client: CustomClient;

    /**
     * @constructor
     * @param {CustomClient} client The {@link CustomClient} instance to handle events and commands for. */
    constructor(client: CustomClient) {
        this.client = client;
    }

    /**
     * Loads events dynamically from the specified directory.
     * @async
     */
    async LoadEvents() {
        const files = (await glob(`build/events/**/*.js`)).map(filePath => path.resolve(filePath));
        files.map(async (file) => {
            const event: Event = new(await import(file)).default(this.client);
            if (!event.name) return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have a name.`);
            const execute = (...args: any) => event.Execute(...args);
            // Registering the event listener with appropriate client method
            if (event.once) this.client.once(event.name as keyof ClientEvents, execute);
            else this.client.on(event.name as keyof ClientEvents, execute);

            return delete require.cache[require.resolve(file)];
        })
    }

    /**
     * Loads commands dynamically from the specified directory.
     * Registers commands or subcommands based on their type.
     * @async
     */
    async LoadCommands() {
        const files = (await glob(`build/commands/**/*.js`)).map(filePath => path.resolve(filePath));
        files.map(async (file) => {
            const command: Command | SubCommand = new(await import(file)).default(this.client);
            if (!command.name) return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have a name.`);
            // @ts-ignore
            const execute = (...args: any) => command.Execute(...args);

            // Checking if the command is a subcommand (determined by file naming convention)
            if (file.split("/").pop()?.split(".")[2])
                this.client.subCommands.set(command.name, command);
            else this.client.commands.set(command.name, command as Command);

            return delete require.cache[require.resolve(file)];
        })
    }
}