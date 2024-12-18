import {ButtonInteraction} from "discord.js";
import {CustomDisTube, type Demido} from "../../DiscordBot.ts";

// TODO: Add documentation
export const data = {
    id: "music.stop",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({content: "No music is currently playing.", ephemeral: true}); // TODO: Use embed
    await queue.stop();
    await distube.nowPlayingMessages.get(interaction.guild!.id)?.delete();
    distube.nowPlayingMessages.delete(interaction.guild!.id);
};
