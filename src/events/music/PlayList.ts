import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import ytdl from "ytdl-core";
import {Song} from "distube";
import ButtonsArchive from "../../utilities/ButtonsArchive";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";
import MusicQueueManager from "../../utilities/MusicQueueManager";

export default class PlayList extends Event {

    static messageEmbed = async (song:Song) => {
        const songInfo = await ytdl.getInfo(song.id!);
        const songUploadDate = new Date(songInfo.videoDetails.uploadDate);
    }

    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "PlayList add Event",
            once: true,
        });
    }

    async Execute() {

        this.client.distubeAddon.on("addList", async (queue, playlist) => {

            const latestMusicQueueMessageData = EmbedMessagesArchive.queue(
                queue,
                MusicQueueManager.currentlySelectedPage(this.client, queue.id) as number
            );
            await this.client.latestMusicQueueMessages[queue.id]?.edit({
                embeds: [latestMusicQueueMessageData.embed],
                components: latestMusicQueueMessageData.components
            }).catch(error => {});
        })

    }
}