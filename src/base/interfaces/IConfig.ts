
/**
 * Interface for the configuration file
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 **/
export default interface IConfig {

    /** The primary color throughout the bot.
     * @type string
     */
    primaryColor: string;

    /** The client id of the bot.
     * @type string
     */
    discordClientId: string;

    /** The client id of the development testing bot.
     * @type string
     */
    devDiscordClientId: string;

    /** The id of the testing guild.
     * @type string
     */
    devGuildId: string;

    /** List of IDs of the developers.
     * @type string[]
     */
    developerUsers: string[];
}