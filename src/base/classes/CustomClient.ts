import Handler from "./Handler";

import "dotenv/config";
import {Client, Collection, IntentsBitField, Message} from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import Command from "./Command";
import SubCommand from "./SubCommand";
import * as console from "node:console";
import DisTube, {StreamType} from "distube";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";
import DeezerPlugin from "@distube/deezer";
import {YtDlpPlugin} from "@distube/yt-dlp";

/**
 * The Demido client class. Manages the core of the entire bot.
 * @class CustomClient
 * @extends Client
 * @implements ICustomClient
 * @version 1.0
 * @author Stefan Cucoranu <elpideus@gmail.com>
 */
export default class CustomClient extends Client implements ICustomClient {

    /** The handler for managing events and commands. */
    handler: Handler;

    /** Indicates whether the bot is running in development mode. */
    developmentMode: boolean;

    /** The main configuration of the entire bot. */
    config: IConfig;

    /** Collection of top-level commands. */
    commands: Collection<string, Command>;

    /** Collection of subcommands. */
    subCommands: Collection<string, SubCommand>;

    /** Collection of command cooldowns. */
    cooldowns: Collection<string, Collection<string, number>>;

    /** A helper for managing DisTube from the client. */
    distubeAddon: DisTube;

    /** Contains the messages for the currently playing songs. */
    nowPlayingMessages: {[guildId: string]: Message<true> | null};

    latestMusicQueueMessages: {[guildId: string]: Message<true> | null};

    /**
     * Creates an instance of the {@link CustomClient}.
     * @constructor
     */
    constructor() {
        super({ intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates] });
        this.config = require(`${process.cwd()}/data/config.json`);
        this.handler = new Handler(this);
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
        this.developmentMode = (process.argv.slice(2).includes("--development"));
        this.distubeAddon = new DisTube(this, {
            nsfw: true,
            leaveOnEmpty: false,
            leaveOnFinish: false,
            leaveOnStop: false,
            plugins: [
                new YtDlpPlugin({ update: true }),
                new SpotifyPlugin({
                    emitEventsAfterFetching: true
                }),
                new SoundCloudPlugin(),
                new DeezerPlugin()
            ]
        });
        this.nowPlayingMessages = {"default": null};
        this.latestMusicQueueMessages = {"default": null};
    }

    /**
     * Initializes the bot.
     * @method
     */
    Init() {
        console.log(`🛠️ | Starting the bot in ${this.developmentMode ? "development" : "production"} mode...`);
        this.LoadHandlers();
        this.login(this.developmentMode ? process.env.TOKEN : process.env.DEVTOKEN).catch((error) => console.error(error));
    }

    /**
     * Loads event and command handlers.
     * @method
     */
    LoadHandlers() {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }

    // TODO: Fix music commands with voice channel checks and stuff
    // TODO: Add a help, info and settings command
    // TODO: Add a greeting and a levelling system
}
