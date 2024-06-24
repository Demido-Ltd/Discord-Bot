import {ButtonInteraction} from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import MusicQueueManager from "../utilities/MusicQueueManager";

/**
 * This function stops the currently playing queue.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function stop_queue (client: CustomClient, interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    await client.distubeAddon.stop(interaction.guild!.id);
    await client.nowPlayingMessages[interaction.guild!.id]?.delete().catch(error => {});
    client.nowPlayingMessages[interaction.guild!.id] = null;
    new MusicQueueManager(client, interaction.guild!.id).delete();
}