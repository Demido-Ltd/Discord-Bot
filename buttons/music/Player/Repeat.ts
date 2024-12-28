import {ButtonInteraction} from "discord.js";
import ButtonsArchive from "../../../utilities/ButtonsArchive.ts";
import {CustomDisTube, type Demido} from "../../../DiscordBot.ts";

// TODO: Add documentation
export const data = {
    id: "music.repeat",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({content: "No music is currently playing.", ephemeral: true}); // TODO: Use embed

    if (queue.repeatMode === 0) await queue.setRepeatMode(1); else await queue.setRepeatMode(0);

    const updatedComponents = ButtonsArchive.player(!queue.paused, queue.repeatMode > 0);
    await interaction.message.edit({ components: updatedComponents });
};
