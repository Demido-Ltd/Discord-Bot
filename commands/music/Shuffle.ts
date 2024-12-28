import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import type {CustomDisTube, Demido} from "../../DiscordBot.ts";
import ButtonsArchive from "../../utilities/ButtonsArchive.ts";
import EmbedsArchive from "../../utilities/EmbedsArchive.ts";

export const data = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the current queue');

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({ content: "No music is currently playing.", ephemeral: true }); // TODO: Use embed

    await queue.shuffle();

    const currentPage: number = parseInt((distube.nowPlayingQueueMessages.get(interaction.guildId!)?.components[1]?.components[1]?.data as {type: number, style: number, label: string, id: number, disabled: boolean, custom_id: string})?.label?.split("/")[0], 10) || 1;
    const queueList = EmbedsArchive.queueList(queue, currentPage);
    const paginationButtons = ButtonsArchive.pagination(currentPage, queueList.totalPages);
    const songSelectionButtons = ButtonsArchive.songSelection(queueList.pageSongs, currentPage);

    const message = await distube.nowPlayingQueueMessages.get(queue.id)?.edit({
        embeds: [queueList.embed],
        components: [songSelectionButtons, paginationButtons]
    });

    if (message) distube.nowPlayingQueueMessages.set(queue.id.toString(), message);

    await interaction.editReply({embeds: [EmbedsArchive.genericSuccessMessage({
            title: "Queue shuffled",
            description: "The queue has been successfully shuffled!"
        })]});
}
