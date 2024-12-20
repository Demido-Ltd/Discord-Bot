import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

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

}