import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
import {Song} from "distube";

export default class ButtonsArchive {

    static musicPlayerControls = (isPaused: boolean = false, song: Song | null = null) => {
        return [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("stop_queue")
                    .setLabel("⏹️ Stop")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(isPaused ? "resume_queue" : "pause_queue")
                    .setLabel(isPaused ? "▶️ Resume" : "⏸️ Pause")
                    .setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("skip_song")
                    .setLabel("⏩ Next")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("list_queue")
                    .setLabel("📝 Queue")
                    .setStyle(ButtonStyle.Secondary),
            )
        ];
    }

}