import {AttachmentBuilder, EmbedBuilder} from "discord.js";
import shell from "../../index.ts";
import type {Song} from "distube";
import path from "node:path";

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
    public static genericErrorMessage = ({title, description, footer = null, error = null, useEmojis = true, emoji = "❗", reportToDevs = true, consoleLog = true}: {
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

    /**
     * Returns a generic success message embed for indicating successful operations.
     *
     * @param {Object} options - The options to customize the success message.
     * @param {string} options.title - The title of the success message.
     * @param {string} options.description - A description of the success.
     * @param {string | null} [options.footer=null] - Text that appears in the footer (optional, defaults to null).
     * @param {any | null} [options.error=null] - An error object, included only if needed for debugging (optional, defaults to null).
     * @param {boolean} [options.useEmojis=true] - Whether to include emojis in the title (optional, defaults to true).
     * @param {string} [options.emoji="✅"] - The emoji to prepend to the title (optional, defaults to "✅").
     *
     * @returns {EmbedBuilder} A Discord embed with the success message.
     *
     * @example
     * // Example usage:
     * const embed = EmbedsArchive.genericSuccessMessage({
     *   title: "Operation Successful",
     *   description: "The command executed successfully.",
     *   footer: "Thank you for using the bot!",
     *   useEmojis: true,
     *   emoji: "🎉",
     * });
     */
    public static genericSuccessMessage = ({title, description, footer = null, useEmojis = true, emoji = "✅"}: {
        title: string; description: string; footer?: string | null; error?: any | null; useEmojis?: boolean; emoji?: string; reportToDevs?: boolean; consoleLog?: boolean; }): EmbedBuilder => {
        const embed = new EmbedBuilder().setColor(parseInt(process.env.DISCORD_SUCCESS_COLOR || "0x20461f", 16));

        if (title) embed.setTitle((emoji && useEmojis ? emoji + " " : "") + title);
        if (description) embed.setDescription(description);
        if (footer) embed.setFooter({ text: footer });

        return embed;
    };

    /**
     * Returns a generic process message embed for indicating ongoing operations.
     *
     * @param {Object} options - The options to customize the process message.
     * @param {string} options.title - The title of the process message.
     * @param {string} options.description - A description of the process.
     * @param {string | null} [options.footer=null] - Text that appears in the footer (optional, defaults to null).
     * @param {any | null} [options.error=null] - An error object, included only if needed for debugging (optional, defaults to null).
     * @param {boolean} [options.useEmojis=true] - Whether to include emojis in the title (optional, defaults to true).
     * @param {string} [options.emoji="⌛"] - The emoji to prepend to the title (optional, defaults to "⌛").
     *
     * @returns {EmbedBuilder} A Discord embed with the process message.
     *
     * @example
     * // Example usage:
     * const embed = EmbedsArchive.genericProcessMessage({
     *   title: "Processing Request",
     *   description: "Please wait while your request is being processed.",
     *   footer: "This may take a few moments.",
     *   useEmojis: true,
     *   emoji: "⏳",
     * });
     */
    public static genericProcessMessage = ({title, description, footer = null, useEmojis = true, emoji = "⌛"}: {
        title: string; description: string; footer?: string | null; error?: any | null; useEmojis?: boolean; emoji?: string; reportToDevs?: boolean; consoleLog?: boolean; }): EmbedBuilder => {
        const embed = new EmbedBuilder().setColor(parseInt(process.env.DISCORD_SUCCESS_COLOR || "0xe6d435", 16));

        if (title) embed.setTitle((emoji && useEmojis ? emoji + " " : "") + title);
        if (description) embed.setDescription(description);
        if (footer) embed.setFooter({ text: footer });

        return embed;
    };


    /**
     * Generates an embed and optional attachment(s) for displaying music player information.
     *
     * @param {Song} song - The song object containing details about the currently playing track.
     *
     * @returns {Object} An object containing the following:
     * - {EmbedBuilder} embed: The embed with the song information.
     * - {AttachmentBuilder[]} attachments: An array of attachments, such as a fallback thumbnail if none is available.
     *
     * @description
     * This method creates a Discord embed that displays the currently playing song's information.
     * If the song has a thumbnail, it is included in the embed; otherwise, a default "no thumbnail available" image
     * is attached. The method also formats the song's views and parses the source for better readability.
     *
     * @example
     * // Handling fallback thumbnail:
     * const song = {
     *   name: "Song Title",
     *   thumbnail: null,
     *   uploader: { name: "Uploader Name", url: "https://uploader-url.com" },
     *   formattedDuration: "3:45",
     *   views: 123456,
     *   source: "Spotify",
     *   url: "https://example.com/song-url",
     * };
     * const { embed, attachments } = EmbedsArchive.musicPlayer(song);
     *
     * @internalMethods
     * - `formatViews(views: number | null | undefined): string`:
     *   Formats the view count for better readability. Converts large numbers to "K" or "M" (e.g., 1,500 -> 1.5K).
     *
     * - `sourceParser(source: string): string`:
     *   Parses the source name to make it more user-friendly (e.g., "youtube" -> "YouTube").
     */

    public static musicPlayer = (song: Song): {embed: EmbedBuilder, attachments: AttachmentBuilder[]} => {
        let data;
        if (!song.thumbnail) data = {
            embed: new EmbedBuilder()
                .setThumbnail("attachment://no_thumbnail_available.png"),
            attachments: [new AttachmentBuilder(path.join(__dirname, "../assets/images/no_thumbnail_available.png"), {name: "no_thumbnail_available.png"})]
        }; else {
            data = {
                embed: new EmbedBuilder()
                    .setThumbnail(song.thumbnail),
                attachments: []
            };
        }

        /**
         * Formats the view count of the song for better readability.
         *
         * @param {number | null | undefined} views - The number of views for the song.
         *
         * @returns {string} A formatted string representing the view count.
         * If the view count is unknown, it returns "unknown".
         *
         * @example
         * formatViews(1500); // Returns "1.5K"
         * formatViews(1000000); // Returns "1M"
         * formatViews(null); // Returns "unknown"
         */
        const formatViews = (views: number | null | undefined): string => {
            if (!views || typeof views === "undefined") return "unknown";
            if (views >= 1_000_000) return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
            else if (views >= 1_000) return (views / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
            return views.toString();
        }

        /**
         * Parses the source of the song to make it more user-friendly.
         *
         * @param {string} source - The source of the song (e.g., "youtube", "spotify").
         *
         * @returns {string} A formatted string representing the source.
         * If the source is unrecognized, it returns the original source string.
         *
         * @example
         * sourceParser("youtube"); // Returns "YouTube"
         * sourceParser("spotify"); // Returns "Spotify"
         * sourceParser("unknownSource"); // Returns "unknownSource"
         */
        const sourceParser = (source: string): string => {
            switch (source.toLowerCase()) {
                case "youtube":
                    return "YouTube";
                case "spotify":
                    return "Spotify";
                case "soundcloud":
                    return "SoundCloud";
                default:
                    return source;
            }
        }

        data.embed
            .setTitle(`[**Now Playing**] ${song.name}`)
            .addFields(
                {name: "By", value: `[${song.uploader.name}](${song.uploader.url})`, inline: true},
                {name: "Duration", value: song.formattedDuration, inline: true},
                {name: "\u200B", value: "\u200B", inline: true},
                {name: "Views", value: formatViews(song.views), inline: true},
                {name: "Link", value: `[${sourceParser(song.source)}](${song.url})`, inline: true},
                {name: "\u200B", value: "\u200B", inline: true}
        )
        return data;
    }

}
