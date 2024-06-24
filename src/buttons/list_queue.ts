import CustomClient from "../base/classes/CustomClient";
import {ButtonInteraction, Message} from "discord.js";
import MusicQueueManager from "../utilities/MusicQueueManager";
import EmbedMessagesArchive from "../utilities/EmbedMessagesArchive";

/**
 * This function sends a message containing the currently playing queue as a list and controls for said queue.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function list_queue(client: CustomClient, interaction: ButtonInteraction) {
    if (client.distubeAddon.getQueue(interaction.guild!.id)!.songs.length <= 1)
        return await interaction.reply({content: "⚠️ There is only one song in the current queue, and it is playing now.", ephemeral: true});

    new MusicQueueManager(client, interaction.guild!.id).delete();
    const messageEmbedAndComponents = EmbedMessagesArchive.queue(client.distubeAddon.getQueue(interaction.guild!.id)!);
    await interaction.reply({
        embeds: [messageEmbedAndComponents.embed],
        components: messageEmbedAndComponents.components
    });
    client.latestMusicQueueMessages[interaction.guild!.id] = await interaction.fetchReply() as Message<true>;
}