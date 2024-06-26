import {ButtonInteraction, EmbedBuilder, Guild} from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import MusicQueueManager from "../utilities/MusicQueueManager";

/**
 * This function skips the currently playing song.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @param {any} opts Options for the current function
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function skip_song (client: CustomClient, interaction: ButtonInteraction, opts: any) {
    const guildId = interaction.guild!.id;
    const songs = opts[0];
    await interaction.deferUpdate();
    const guild: Guild | undefined = client.guilds.cache.get(interaction.guild!.id);
    const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;

    if (userVoiceChannel !== guild!.members.cache.get(client.user!.id)!.voice.channel) {
        return interaction.reply({embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`❌ | You need to be in ${guild!.members.cache.get(client.user!.id)!.voice.channel} if you want to skip the track.`)
            ], ephemeral: true});
    }

    const queueLength = client.distubeAddon.getQueue(guildId)!.songs.length;
    if (queueLength <= 1 || (songs && songs >= queueLength)) {
        client.nowPlayingMessages[guildId]?.delete().catch(error => {});
        client.nowPlayingMessages[guildId] = null;
        new MusicQueueManager(client, guildId).delete()
        return await client.distubeAddon.stop(guildId);}

    if (songs) return await client.distubeAddon.jump(guildId, parseInt(songs));
    else await client.distubeAddon.skip(guildId);

    if (client.latestMusicQueueMessages[guildId]) await new MusicQueueManager(client, guildId).update();
}