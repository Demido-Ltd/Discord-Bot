import "dotenv/config";
import { Client, GatewayIntentBits, type ClientOptions } from "discord.js";
import CommandsHandler from "./handlers/CommandsHandler.ts";
import chalk from "chalk";

export class Demido extends Client {
    commands: Map<string, any>;
    buttons: Map<string, any>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Map<string, any>();
        this.buttons = new Map<string, any>();
    }
}

export class DiscordBot {
    static client: Demido | null = null; // Store the client instance

    static run = async () => {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        }) as Demido;

        this.client.commands = new Map<string, any>();
        this.client.buttons = new Map<string, any>();

        this.client.once("ready", async () => new CommandsHandler(this.client!));

        return this.client.login(process.env.DISCORD_BOT_TOKEN).then(async () => {
            return `${this.client!.user!.displayName} ready and at your service!`;
        });
    }

    static async stop() {
        if (!this.client) return;

        try {
            console.log("Stopping Discord bot...");
            console.log(chalk.gray("(This may take a while)"));
            await this.client.destroy();
        } catch (error) {
            console.error("Error stopping Discord bot:", error);
        } finally {
            this.client = null;
        }
    }
}
