import CustomClient from "../classes/CustomClient";

/**
 * Command options interface for configuring commands.
 * @interface ICommandOptions
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default interface ICommandOptions {

    /** The client instance.
     * @type {CustomClient}
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
}