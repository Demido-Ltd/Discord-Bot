import { EmbedBuilder } from "discord.js";
import shell from "../../index.ts";
import type {Song} from "distube";

export default class EmbedsArchive {

    /**
     * Returns a generic error message embed for better error visualization. Also allows for logging via Discord
     * messages to the developers and/or terminal.
     *
     * @param {Object} options - The options to customize the error message.
     * @param {string} options.title - The title of the error message.
     * @param {string} options.description - A description of the error.
     * @param {string | null} [options.footer=null] - Text that appears in the footer (optional, defaults to null).
     * @param {any | null} [options.error=null] - The actual error object (optional, defaults to null).
     * @param {boolean} [options.useEmojis=true] - Whether to include emojis in the title (optional, defaults to true).
     * @param {string} [options.emoji="❗ "] - The emoji to prepend to the title (optional, defaults to "❗ ").
     * @param {boolean} [options.reportToDevs=true] - Whether to report the error to developers (optional, defaults to true).
     * @param {boolean} [options.consoleLog=true] - Whether to log the error to the console (optional, defaults to true).
     *
     * @returns {EmbedBuilder} A Discord embed with the error message.
     *
     * @example
     * // Example usage:
     * const embed = EmbedsArchive.genericErrorMessage({
     *   title: "Something went wrong.",
     *   description: "An error occurred while executing the command.",
     *   footer: "Please try again later.",
     *   error: someErrorThatHappened(),
     *   useEmojis: true,
     *   emoji: "⚠️",
     *   reportToDevs: true,
     *   consoleLog: false,
     * });
     */
    public static genericErrorMessage = ({title, description, footer = null, error = null, useEmojis = true, emoji = "❗ ", reportToDevs = true, consoleLog = true}: {
        title: string; description: string; footer?: string | null; error?: any | null; useEmojis?: boolean; emoji?: string; reportToDevs?: boolean; consoleLog?: boolean; }): EmbedBuilder => {
        const embed = new EmbedBuilder().setColor(parseInt(process.env.DISCORD_ERROR_COLOR || "0xf0473e", 16));

        if (title) embed.setTitle((emoji && useEmojis ? emoji + " " : "") + title);
        if (description) embed.setDescription(description);
        if (footer) embed.setFooter({ text: footer });
        if (consoleLog) {
            console.log(!error);
            console.error(title + "\n", description + (error ? "\n" : ""), error ?? "");
            shell.promptUser().then();
        }

        return embed;
    };

    public static musicPlayer = (song: Song, playing: boolean = true) => {
        // TODO: Add music player embed with buttons and everything
    }
}
