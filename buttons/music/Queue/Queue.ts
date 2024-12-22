import {ButtonInteraction} from "discord.js";
import ButtonsArchive from "../../../utilities/ButtonsArchive.ts";
import {CustomDisTube, type Demido} from "../../../DiscordBot.ts";
import EmbedsArchive from "../../../utilities/EmbedsArchive.ts";

// TODO: Add documentation
export const data = {
    id: "music.queue",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({ content: "No music is currently playing.", ephemeral: true }); // TODO: Use embed

    const queueList = EmbedsArchive.queueList(queue);
    const paginationButtons = ButtonsArchive.pagination(queueList.page, queueList.totalPages);
    const songSelectionButtons = ButtonsArchive.songSelection(queueList.pageSongs, queueList.page);

    await interaction.followUp({
        embeds: [queueList.embed],
        components: [songSelectionButtons, paginationButtons],
        ephemeral: true
    });
};
