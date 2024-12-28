import { ButtonInteraction } from "discord.js";
import ButtonsArchive from "../../../utilities/ButtonsArchive.ts";
import { CustomDisTube, type Demido } from "../../../DiscordBot.ts";

// TODO: Add documentation
export const data = {
    id: "music.resume",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guild!.id);

    if (!queue) return interaction.followUp({ content: "No music is currently playing.", ephemeral: true });

    try {
        if (queue.paused) await distube.resume(interaction.guildId!); else await distube.pause(interaction.guildId!);
        const updatedComponents = ButtonsArchive.player(true, queue.repeatMode > 0);
        await interaction.message.edit({ components: updatedComponents });
    } catch (error: any) {
        if (error.code === "PAUSED") await interaction.followUp({ content: "The queue is already paused.", ephemeral: true });
        else {
            console.error(`[DEMIDO] -> Error executing button music.resume:`, error);
            await interaction.followUp({ content: "An unexpected error occurred.", ephemeral: true });
        }
    }
};
