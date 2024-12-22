import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import type {CustomDisTube, Demido} from "../../DiscordBot.ts";
import EmbedsArchive from "../../utilities/EmbedsArchive.ts";
import ButtonsArchive from "../../utilities/ButtonsArchive.ts";

export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows you the current queue of songs.');
    // TODO: Add page option

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({ content: "No music is currently playing.", ephemeral: true }); // TODO: Use embed

    const queueList = EmbedsArchive.queueList(queue);
    const paginationButtons = ButtonsArchive.pagination(queueList.page, queueList.totalPages);
    const songSelectionButtons = ButtonsArchive.songSelection(queueList.pageSongs, queueList.page);

    await interaction.followUp({
        embeds: [queueList.embed],
        components: [songSelectionButtons, paginationButtons]
    });
}