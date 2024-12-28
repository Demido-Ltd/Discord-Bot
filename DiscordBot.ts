import "dotenv/config";
import {Client, GatewayIntentBits, type ClientOptions, Message} from "discord.js";
import chalk from "chalk";
import CommandsHandler from "./handlers/CommandsHandler.ts";
import DisTube, {type DisTubeOptions} from "distube";
import {YtDlpPlugin} from "@distube/yt-dlp";
import {YouTubePlugin} from "@distube/youtube";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";
import AppleMusicPlugin from "distube-apple-music";
import EventsHandler from "./handlers/EventsHandler.ts";
import ButtonsHandler from "./handlers/ButtonsHandler.ts";
import path from "node:path";
import fs from "node:fs";

/**
 * Represents the custom Discord client class, extending the default `Client` from `discord.js`.
 * It adds custom properties like `commands`, `buttons`, and `distube` to the client instance.
 */
export class Demido extends Client {

    /**
     * A Map that holds the commands available for the bot.
     * @type {Map<string, any>}
     */
    commands: Map<string, any>;

    /**
     * A Map that holds the button interactions available for the bot.
     * @type {Map<string, any>}
     */
    buttons: Map<string, any>;

    /**
     * The instance of `DisTube` used for music-related functionality.
     * @type {DisTube | null}
     */
    distube: DisTube | null;

    /**
     * Constructs a new `Demido` client instance.
     * @param {ClientOptions} options - The options to initialize the client with.
     */
    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Map<string, any>();
        this.buttons = new Map<string, any>();
        this.distube = null;
    }
}

/**
 * Custom extension of `DisTube` that adds a `nowPlayingMessages` Map for tracking "Now Playing" messages and
 * a `nowPlayingQueueMessages` Map for tracking "Queue" messages.
 */
export class CustomDisTube extends DisTube {

    /**
     * A Map that tracks the "Now Playing" messages for each guild.
     * @type {Map<string, Message>}
     */
    nowPlayingMessages: Map<string, Message>;

    /**
     * A Map that tracks the "Queue" messages for each guild.
     * @type {Map<string, Message>}
     */
    nowPlayingQueueMessages: Map<string, Message>

    /**
     * Constructs a new `CustomDisTube` instance.
     * @param {Client<boolean>} client - The Discord client instance.
     * @param {DisTubeOptions | undefined} options - The options to configure the DisTube instance.
     */
    constructor(client: Client<boolean>, options: DisTubeOptions | undefined) {
        super(client, options);
        this.nowPlayingMessages = new Map<string, Message>();
        this.nowPlayingQueueMessages = new Map<string, Message>();
    }
}

/**
 * The main bot class responsible for running the Discord bot and handling music functionality with `DisTube`.
 */
export class DiscordBot {

    /**
     * The singleton instance of the `Demido` client.
     * @type {Demido | null}
     */
    static client: Demido | null = null;

    /**
     * Starts the Discord bot, initializes the `DisTube` client, and sets up the necessary handlers.
     * @returns {Promise<Demido>} A promise that resolves to the `Demido` client instance.
     */
    static run = async (): Promise<Demido> => {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ]
        }) as Demido;

        const loadYouTubeCookies = (): any[] => {
            const cookiesPath = path.join(__dirname, '../cookies/YouTube.json'); // Adjust the path if necessary
            const cookiesData = fs.readFileSync(cookiesPath, 'utf-8');
            return JSON.parse(cookiesData);
        };

        if (process.env.MUSIC) {
            client.distube = new DisTube(client, {
                plugins: [
                    new YouTubePlugin({cookies: loadYouTubeCookies()}),
                    ...(process.env.SPOTIFY ? [new SpotifyPlugin({
                        api: {
                            clientId: process.env.SPOTIFY_CLIENT_ID,
                            clientSecret: process.env.SPOTIFY_SECRET,
                            topTracksCountry: process.env.SPOTIFY_COUNTRY
                        }
                    })] : []),
                    ...(process.env.SOUNDCLOUD ? [new SoundCloudPlugin()] : []),
                    ...(process.env.APPLE_MUSIC ? [new AppleMusicPlugin()] : []),
                    new YtDlpPlugin({update: false})
                ]
            });
            (client.distube as CustomDisTube).nowPlayingMessages = new Map<string, Message>;
            (client.distube as CustomDisTube).nowPlayingQueueMessages = new Map<string, Message>;
        }

        client.once("ready", async () => {
            new CommandsHandler(this.client!);
            new ButtonsHandler(this.client!)
            new EventsHandler(this.client!);
        });

        return client.login(process.env.DISCORD_BOT_TOKEN).then(async () => {
            console.log(`${client!.user!.displayName} ready and at your service!`);
            this.client = client
            this.client.commands = new Map<string, any>();
            this.client.buttons = new Map<string, any>();
            return this.client;
        });
    }

    /**
     * Stops the Discord bot and disconnects it from the Discord server.
     * @returns {Promise<void>} A promise that resolves when the bot is successfully stopped.
     */
    static async stop(): Promise<void> {
        if (!this.client) return;

        try {
            console.log("Stopping Discord bot...");
            console.log(chalk.gray("(This may take a while)"));
            await this.client.destroy();
            const clearLines = (lines: number) => {
                for (let i = 0; i < lines; i++) {
                    process.stdout.moveCursor(0, -1);
                    process.stdout.clearLine(1);
                }
            };
            clearLines(2);
        } catch (error) {
            console.error("Error stopping Discord bot:", error);
        } finally {
            this.client = null;
        }
    }
}