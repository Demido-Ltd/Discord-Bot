import {ButtonInteraction, EmbedBuilder, Guild} from "discord.js";
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
    const guild: Guild | undefined = client.guilds.cache.get(interaction.guild!.id);
    const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;

    if (userVoiceChannel !== guild!.members.cache.get(client.user!.id)!.voice.channel) {
        return interaction.reply({embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`❌ | You need to be in ${guild!.members.cache.get(client.user!.id)!.voice.channel} if you want to stop the music.`)
            ], ephemeral: true});
    }
    await interaction.deferUpdate();
    await client.distubeAddon.stop(interaction.guild!.id);
    await client.nowPlayingMessages[interaction.guild!.id]?.delete().catch(error => {});
    client.nowPlayingMessages[interaction.guild!.id] = null;
    new MusicQueueManager(client, interaction.guild!.id).delete();
}