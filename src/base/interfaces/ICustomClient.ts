import IConfig from "./IConfig";
import {Collection, Message} from "discord.js";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";
import DisTube from "distube";

/**
 * Represents a custom client interface for the Demido Discord bot.
 * @interface ICustomClient
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default interface ICustomClient {

    /** The configuration settings for the client.
     * @type {IConfig}
     */
    config: IConfig;

    /** A collection of commands available to the client.
     * @type {Collection<string, Command>}
     */
    commands: Collection<string, Command>;

    /** A collection of sub-commands available to the client.
     * @type {Collection<string, SubCommand>}
     */
    subCommands: Collection<string, SubCommand>;

    /** A collection of cooldowns for commands, mapped by user ID and command name.
     * @type {Collection<string, Collection<string, number>>}
     */
    cooldowns: Collection<string, Collection<string, number>>;

    /** Indicates whether the client is running in development mode.
     * @type {boolean}
     */
    developmentMode: boolean;

    /** The DisTube addon for music functionality.
     * @type {DisTube}
     */
    distubeAddon: DisTube;

    /** A collection of 'Now Playing' messages, mapped by guild ID.
     * @type {Object.<string, (Message<true> | null)>}
     */
    nowPlayingMessages: {[guildId: string]: Message<true> | null};

    latestMusicQueueMessages: {[guildId: string]: Message<true> | null};

    /**
     * Initializes the client.
     * @function
     * @name ICustomClient#Init
     * @returns {void}
     */
    Init(): void;

    /**
     * Loads the event handlers for the client.
     * @function
     * @name ICustomClient#LoadHandlers
     * @returns {void}
     */
    LoadHandlers(): void;
}