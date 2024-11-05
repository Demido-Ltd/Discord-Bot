import "dotenv/config";
import { Client, GatewayIntentBits, type ClientOptions } from "discord.js";
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
        const client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        }) as Demido;

        // this.client.once("ready", async () => new CommandsHandler(this.client!));

        return client.login(process.env.DISCORD_BOT_TOKEN).then(async () => {
            console.log(`${client!.user!.displayName} ready and at your service!`);
            this.client = client
            this.client.commands = new Map<string, any>();
            this.client.buttons = new Map<string, any>();
            return this.client;
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
