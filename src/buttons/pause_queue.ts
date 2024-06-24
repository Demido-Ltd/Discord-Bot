import {ButtonInteraction, EmbedBuilder} from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import ButtonsArchive from "../utilities/ButtonsArchive";
import EmbedMessagesArchive from "../utilities/EmbedMessagesArchive";


/**
 * This function pauses the currently playing song or queue.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function pause_queue (client: CustomClient, interaction: ButtonInteraction) {
    await client.nowPlayingMessages[interaction.guild!.id]!.edit({
        embeds: [await EmbedMessagesArchive.musicPlayerEmbed(client.distubeAddon.getQueue(interaction.guild!.id)!.songs[0], true, interaction)],
        components: ButtonsArchive.musicPlayerControls(true, client.distubeAddon.getQueue(interaction.guild!.id)!.songs[0])
    });
    await interaction.deferUpdate();
    client.distubeAddon.pause(interaction.guild!.id);
}