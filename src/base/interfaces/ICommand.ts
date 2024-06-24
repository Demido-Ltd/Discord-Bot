import CustomClient from "../classes/CustomClient";
import {AutocompleteInteraction, ChatInputCommandInteraction} from "discord.js";

/**
 * Interface representing a command.
 * @interface ICommand
 */
export default interface ICommand {

    /** The client instance associated with the command.
     * @type CustomClient
     */
    client: CustomClient;

    /** The name/identifier of the command.
     * @type string
     */
    name: string;

    /** The description of the command.
     * @type string
     */
    description: string;

    /** The category of the command.
     * @type string
     */
    category: string;

    /** Additional options for the command (like subcommands). */
    options: object;

    /** Default permissions required for members to use the command.
     * @type bigint
     */
    default_member_permissions: bigint;

    /** Whether the command can be used in private messages.
     * @type boolean
     */
    dm_permission: boolean;

    /** Cooldown period (in seconds) for the command.
     * @type number
     */
    cooldown: number;

    /** Indicates if the command is intended for development/testing purposes and as such can only be used by the developers.
     * @type boolean
     */
    dev: boolean;

    /**
     * Executes the command.
     * @param {ChatInputCommandInteraction} interaction The interaction object for a chat input command.
     * @returns {void}
     */
    Execute(interaction: ChatInputCommandInteraction): void;

    /**
     * Handles autocomplete for the command.
     * @param {AutocompleteInteraction} interaction The interaction object for an autocomplete input.
     * @returns {void}
     */
    AutoComplete(interaction: AutocompleteInteraction): void;

}