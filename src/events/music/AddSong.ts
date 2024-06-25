import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";
import MusicQueueManager from "../../utilities/MusicQueueManager";

/**
 * Gets triggered whenever a song gets added to the queue.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class AddSong extends Event {

    /**
     * @constructor
     * Initializes the AddSong class.
     * @param {CustomClient} client The bot client instance
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Triggers each time a song gets added to the queue.",
            once: true,
        });
    }

    /**
     * Executes the code whenever the [event]{@link AddSong} gets triggered.
     * @return Promise<void>
     */
    async Execute() {

        this.client.distubeAddon.on("addSong", async (queue): Promise<void> => {

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