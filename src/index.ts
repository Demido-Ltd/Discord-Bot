import { Client, GatewayIntentBits, type ClientOptions } from 'discord.js';
import './handlers/CommandsHandler';
import dotenv from 'dotenv';
import CommandsHandler from "./handlers/CommandsHandler.ts";
import DemidoShell from "./utilities/DemidoShell.ts";
dotenv.config(); // Loading .env configuration

/* Utility class that allows {@link Client} to store commands and buttons information without TypeScript returning errors. */
export class Demido extends Client {
    commands: Map<any, any>;
    buttons: Map<any, any>;
    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Map();
        this.buttons = new Map();
    }
}

/* The actual {@link [Discord.JS](https://discord.js.org/)} client. Declaring it as {@link Demido} to allow storage of data directly into the client and avoid errors. */
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
}) as Demido;
client.commands = new Map();
client.buttons = new Map();

client.once('ready', async () => new CommandsHandler(client)); // Gets executed once the bot is ready.

client.login(process.env.TOKEN).then(async () => {
    console.log(`${client.user?.displayName} ready and at your service!`);
    new DemidoShell(client);
});
