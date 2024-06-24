import ICommand from "../interfaces/ICommand";
import CustomClient from "./CustomClient";
import {AutocompleteInteraction, ChatInputCommandInteraction} from "discord.js";
import ICommandOptions from "../interfaces/ICommandOptions";

/**
 * Represents a slash command.
 * @implements ICommand
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Command implements ICommand{

    /** The category of the command.
     * @type string
     */
    category: string;

    /** The client instance associated with this command.
     * @type CustomClient
     */
    client: CustomClient;

    /** Cooldown period (in seconds) for this command.
     * @type number
     */
    cooldown: number;

    /** Default permissions required for members to use this command.
     * @type bigint
     */
    default_member_permissions: bigint;

    /** The description of the command.
     * @type string
     */
    description: string;

    /** Whether this command can be used in private messages.
     * @type boolean
     */
    dm_permission: boolean;

    /** The name/identifier of the command.
     * @type string
     */
    name: string;

    /** Additional options for the command (like subcommands). */
    options: object;

    /** Indicates if this command is intended for development/testing purposes and as such can only be used by the developers.
     * @type boolean
     */
    dev: boolean;

    /**
     * Creates an instance of {@link Command}.
     * @param {CustomClient} client The custom client instance.
     * @param {ICommandOptions} options The options to initialize the command.
     */
    constructor(client: CustomClient, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.default_member_permissions = options.default_member_permissions;
        this.dm_permission = options.dm_permission;
        this.cooldown = options.cooldown;
        this.dev = options.dev;
    }

    /**
     * Method to handle autocomplete interactions for this command.
     * @param {AutocompleteInteraction} interaction The autocomplete interaction.
     * @returns {void}
     * @method
     */
    AutoComplete(interaction: AutocompleteInteraction): void {}

    /**
     * Method to execute the command based on a chat input interaction.
     * @param {ChatInputCommandInteraction} interaction The command interaction.
     * @method
     */
    Execute(interaction: ChatInputCommandInteraction) {}
}