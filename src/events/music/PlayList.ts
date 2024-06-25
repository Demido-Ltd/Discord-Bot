import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import ytdl from "ytdl-core";
import {Song} from "distube";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";
import MusicQueueManager from "../../utilities/MusicQueueManager";

/**
 * Handles a playlist play request to the bot.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class PlayList extends Event {

    /**
     * @constructor
     * Initializes the {@link PlayList} class.
     * @param {CustomClient} client The bot client
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "PlayList add Event",
            once: true,
        });
    }

    async Execute() {

        this.client.distubeAddon.on("addList", async (queue) => {

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