import {ButtonInteraction} from "discord.js";
import ButtonsArchive from "../../../utilities/ButtonsArchive.ts";
import {CustomDisTube, type Demido} from "../../../DiscordBot.ts";
import EmbedsArchive from "../../../utilities/EmbedsArchive.ts";

// TODO: Add documentation
export const data = {
    id: "queue.shuffle",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({ content: "No music is currently playing.", ephemeral: true }); // TODO: Use embed

    await queue.shuffle();

    const currentPage: number = parseInt((interaction.message.components[1].components[1].data as {type: number, style: number, label: string, id: number, disabled: boolean, custom_id: string}).label.split("/")[0], 10);
    const queueList = EmbedsArchive.queueList(queue, currentPage);
    const paginationButtons = ButtonsArchive.pagination(currentPage, queueList.totalPages);
    const songSelectionButtons = ButtonsArchive.songSelection(queueList.pageSongs, currentPage);

    const message = await distube.nowPlayingQueueMessages.get(queue.id)?.edit({
        embeds: [queueList.embed],
        components: [songSelectionButtons, paginationButtons]
    });

    if (message) distube.nowPlayingQueueMessages.set(queue.id.toString(), message);
};
