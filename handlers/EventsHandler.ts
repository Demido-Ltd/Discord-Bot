import { Demido } from "../DiscordBot.ts";
import path from "node:path";
import fs from "node:fs";

/**
 * Handles loading and managing events for the Discord bot, including loading event files dynamically
 * from a specified directory and registering event handlers.
 */
export default class EventsHandler {

    private client: Demido;

    /**
     * Creates an instance of the EventsHandler class and initializes event loading.
     *
     * @param {Demido} client - The Discord bot client to associate with this event handler.
     */
    constructor(client: Demido) {
        this.client = client;
        this.loadEvents().then();
    }

    /**
     * Loads events from the events directory and registers them with the Discord bot client.
     * This method recursively searches the events directory for `.ts` files and imports them.
     * It also checks for specific conditions, such as whether the music feature is enabled, before registering the event.
     *
     * @private
     * @returns {Promise<void>} A promise that resolves once all events are loaded.
     */
    private loadEvents = async () => {
        const eventsDir = path.join(__dirname, "../events");

        /**
         * Recursively loads event files from a given directory and registers them with the bot client.
         *
         * @private
         * @param {string} directory - The directory to load event files from.
         * @returns {Promise<void>} A promise that resolves once the events from the directory are loaded.
         */
        const loadEventsFromDirectory = async (directory: string) => {
            const files = fs.readdirSync(directory);
            for (const file of files) {
                if (!process.env.MUSIC && file === "music" || !this.client.distube) continue;
                const filePath = path.join(directory, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) await loadEventsFromDirectory(filePath);
                else if (file.endsWith(".ts")) {
                    const event = (await import(filePath));
                    if (!event.default || !event.default.execute || !event.default.type) continue;
                    const handler = async (...args: any[]) => await event.default.execute(this.client, ...args);
                    if (process.env.MUSIC && filePath.includes("music") && this.client.distube)  {
                        this.client.distube.on(event.default.type, handler);
                        continue;
                    }
                    this.client.on(event.default.type, handler);
                }
            }
        }

        await loadEventsFromDirectory(eventsDir);
    }
}
