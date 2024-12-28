import {ButtonInteraction} from "discord.js";
import ButtonsArchive from "../../../utilities/ButtonsArchive.ts";
import {CustomDisTube, type Demido} from "../../../DiscordBot.ts";
import EmbedsArchive from "../../../utilities/EmbedsArchive.ts";

// TODO: Add documentation
export const data = {
    id: "queue.close",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const distube = (interaction.client as Demido).distube as CustomDisTube;

    await interaction.message.delete();
    distube.nowPlayingQueueMessages.delete(interaction.guildId!);
};
