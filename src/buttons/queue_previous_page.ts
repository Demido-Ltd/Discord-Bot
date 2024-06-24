import CustomClient from "../base/classes/CustomClient";
import {ButtonInteraction, Message} from "discord.js";
import MusicQueueManager from "../utilities/MusicQueueManager";
import EmbedMessagesArchive from "../utilities/EmbedMessagesArchive";

/**
 * This function updates the queue message and shows the previous page of songs in the queue.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function queue_previous_page (client: CustomClient, interaction: ButtonInteraction) {
    await interaction.deferUpdate();

    const messageEmbedAndComponents = EmbedMessagesArchive.queue(client.distubeAddon.getQueue(
        interaction.guild!.id)!,
        MusicQueueManager.currentlySelectedPage(client, interaction.guild!.id, false) as number - 1);
    await interaction.message.edit({
        embeds: [messageEmbedAndComponents.embed],
        components: messageEmbedAndComponents.components
    });
    client.latestMusicQueueMessages[interaction.guild!.id] = interaction.message as Message<true>;

}