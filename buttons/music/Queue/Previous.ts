import {ButtonInteraction} from "discord.js";
import ButtonsArchive from "../../../utilities/ButtonsArchive.ts";
import {CustomDisTube, type Demido} from "../../../DiscordBot.ts";
import EmbedsArchive from "../../../utilities/EmbedsArchive.ts";

// TODO: Add documentation
export const data = {
    id: "queue.pagination.prev",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.editReply({ content: "No music is currently playing."}); // TODO: Use embed

    const newPage: number = parseInt((interaction.message.components[1].components[1].data as {type: number, style: number, label: string, id: number, disabled: boolean, custom_id: string}).label.split("/")[0], 10) - 1;
    const queueList = EmbedsArchive.queueList(queue, newPage);
    const paginationButtons = ButtonsArchive.pagination(newPage, queueList.totalPages);
    const songSelectionButtons = ButtonsArchive.songSelection(queueList.pageSongs, newPage);

    await interaction.editReply({
        embeds: [queueList.embed],
        components: [songSelectionButtons, paginationButtons]
    });
};
