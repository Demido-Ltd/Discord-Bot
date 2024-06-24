import CustomClient from "../base/classes/CustomClient";
import {ButtonInteraction, Message} from "discord.js";
import MusicQueueManager from "../utilities/MusicQueueManager";
import EmbedMessagesArchive from "../utilities/EmbedMessagesArchive";

/**
 * This function shuffles the currently playing queue.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function shuffle_queue(client: CustomClient, interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    client.distubeAddon.getQueue(interaction.guild!.id)?.shuffle().catch(error => {}).then(queue => {
        new MusicQueueManager(client, interaction.guild!.id).update();
    });

}