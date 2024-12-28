import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
import Numbermoji from "./Numbermoji.ts";

/**
 * A utility class for generating reusable button components for Discord interactions.
 */
export default class ButtonsArchive {

    /**
     * Generates a set of music player control buttons.
     *
     * @param {boolean} [playing=true] - Indicates whether the music is currently playing (optional, defaults to true).
     * @param {boolean} [repeating=false] - Indicates whether the music is set to repeat (optional, defaults to false).
     *
     * @returns {ActionRowBuilder<ButtonBuilder>[]} An array containing a single ActionRow with the following buttons:
     * - **Stop**: Stops the music playback.
     * - **Play/Pause**: Toggles between playing and pausing the music.
     * - **Next**: Skips to the next track in the queue.
     * - **Repeat**: Toggles repeat mode for the current track or queue.
     * - **Queue**: Displays the current music queue.
     *
     * @example
     * // Example usage:
     * const buttons = ButtonsArchive.player(true, false);
     * // Add the buttons to a Discord message:
     * await interaction.reply({ content: "Music controls:", components: buttons });
     */
    public static player(playing: boolean = true, repeating: boolean = false): ActionRowBuilder<ButtonBuilder>[] {
        const stop = new ButtonBuilder()
            .setCustomId("music.stop")
            .setLabel("⏹️")
            .setStyle(ButtonStyle.Danger);

        const play_pause = new ButtonBuilder()
            .setCustomId(playing ? "music.pause" : "music.resume")
            .setLabel(playing ? "⏸️" : "▶️")
            .setStyle(playing ? ButtonStyle.Secondary : ButtonStyle.Success);

        const next = new ButtonBuilder()
            .setCustomId("music.next")
            .setLabel("⏩")
            .setStyle(ButtonStyle.Secondary);

        const repeat = new ButtonBuilder()
            .setCustomId("music.repeat")
            .setLabel("🔁")
            .setStyle(repeating ? ButtonStyle.Success : ButtonStyle.Secondary);

        const queue = new ButtonBuilder()
            .setCustomId("music.queue")
            .setLabel("📃")
            .setStyle(ButtonStyle.Secondary);

        return [new ActionRowBuilder<ButtonBuilder>().addComponents(stop, play_pause, next, repeat, queue)];

    }


    /**
     * Generates pagination buttons for navigating through pages.
     *
     * @param {number} currentPage - The current page number.
     * @param {number} totalPages - The total number of available pages.
     *
     * @param type The type of menu where the pagination is.
     * @returns {ActionRowBuilder<ButtonBuilder>} An ActionRow with pagination buttons:
     * - **⬅️**: Navigates to the previous page.
     * - **[currentPage/totalPages]**: Displays the current page and total pages in a disabled button.
     * - **➡️**: Navigates to the next page.
     */
    public static pagination(currentPage: number, totalPages: number = 1, type: string = "queue"): ActionRowBuilder<ButtonBuilder> {
        const prev = new ButtonBuilder()
            .setCustomId(`${type}.pagination.prev`)
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage === 1);

        const pageNumber = new ButtonBuilder()
            .setCustomId(`${type}.pagination.page`)
            .setLabel(`${currentPage}/${totalPages}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId(`${type}.pagination.next`)
            .setLabel("➡️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage === totalPages);

        const buttonsActionRow = new ActionRowBuilder<ButtonBuilder>();

        if (totalPages > 1) buttonsActionRow.addComponents(prev, pageNumber, next);

        if (type === "queue")
            buttonsActionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId("queue.shuffle")
                    .setLabel("🔀")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("queue.close")
                    .setLabel("❌")
                    .setStyle(ButtonStyle.Secondary)
            );

        return buttonsActionRow;
    }

    public static songSelection(pageSongs: any[], page: number): ActionRowBuilder<ButtonBuilder> {
        const songButtons = pageSongs.map((song, i) => {
            const buttonId = `queue.song.${page}.${i}`;
            return new ButtonBuilder()
                .setCustomId(buttonId)
                .setLabel(Numbermoji.emojify(i + 1))
                .setStyle(ButtonStyle.Secondary);
        });

        return new ActionRowBuilder<ButtonBuilder>().addComponents(...songButtons);
    }

}