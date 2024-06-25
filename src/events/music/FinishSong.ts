import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";
import ButtonsArchive from "../../utilities/ButtonsArchive";
import MusicQueueManager from "../../utilities/MusicQueueManager";

/**
 * Event that gets triggered whenever a song has finished playing.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class FinishSong extends Event {

    /**
     * @constructor
     * Initializes the {@link FinishSong} class.
     * @param {CustomClient} client The bot client
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Stop Event",
            once: true,
        });
    }

    async Execute() {

        this.client.distubeAddon.on("finishSong", async (queue) => {
            const voiceChannel = queue.voiceChannel;
            if (voiceChannel) {

                const nowPlayingMessage = this.client.nowPlayingMessages[voiceChannel.guild.id];
                if (nowPlayingMessage) {
                    if (queue.songs.length <= 1) {
                        await nowPlayingMessage.delete().catch(error => {});
                        this.client.nowPlayingMessages[voiceChannel.guild.id] = null;
                    } else
                    await nowPlayingMessage.edit({embeds: [await EmbedMessagesArchive.musicPlayerEmbed(queue.songs[1])],
                        components: ButtonsArchive.musicPlayerControls(false, queue.songs[0])});
                }

                const latestMusicQueueMessage = this.client.latestMusicQueueMessages[voiceChannel.guild.id];
                if (latestMusicQueueMessage) {
                    if (queue.songs.length <= 1) {
                        new MusicQueueManager(this.client, voiceChannel.guild.id).delete();
                    } else if (queue.songs.length > 1) {
                        await new MusicQueueManager(this.client, voiceChannel.guild.id).update();
                    }
                }
            }
        });

    }
}