import { Demido } from "../DiscordBot.ts";
import path from "node:path";
import fs from "node:fs";
import { Events } from "discord.js";

export default class EventsHandler {

    private client: Demido;

    constructor(client: Demido) {
        this.client = client;
        this.loadEvents().then();
    }

    private loadEvents = async () => {
        const eventsDir = path.join(__dirname, "../events");

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
                    const handler = async (...args: any[]) => await event.default.execute(...args);
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
