import ISubCommand from "../interfaces/ISubCommand";
import CustomClient from "./CustomClient";
import {ChatInputCommandInteraction} from "discord.js";
import ISubCommandOptions from "../interfaces/ISubCommandOptions";

/**
 * Represents a subcommand.
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class SubCommand implements ISubCommand {

    /**
     * The {@link CustomClient} instance that manages this sub-command.
     * @type {CustomClient}
     */
    client: CustomClient;

    /**
     * The name of the sub-command.
     * @type {string}
     */
    name: string;

    /**
     * @constructor
     * Creates a new SubCommand instance.
     * @param {CustomClient} client The CustomClient instance.
     * @param {ISubCommandOptions} options Options for configuring the sub-command.
     */
    constructor(client: CustomClient, options: ISubCommandOptions) {
        this.client = client;
        this.name = options.name;
    }

    /**
     * Executes the sub-command logic when invoked by an interaction.
     * @param {ChatInputCommandInteraction} interaction The interaction triggered by the user.
     * @returns {void}
     */
    Execute(interaction: ChatInputCommandInteraction): void {
    }

}