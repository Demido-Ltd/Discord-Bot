import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

// TODO: Add documentation
export default class ButtonsArchive {

    public static player(playing: boolean = true, repeating: boolean = false) {
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

        // TODO: Make the buttons work

    }

}