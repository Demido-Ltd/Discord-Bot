import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import {Queue} from "distube";

/**
 * Event that gets triggered whenever the bot gets disconnected (kicked) from the voice channel.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Disconnect extends Event {

    /**
     * @constructor
     * Initializes the {@link Disconnect} class.
     * @param {CustomClient} client The bot client
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Handles the bot disconnection from the voice channel.",
            once: true,
        });
    }

    async Execute() {

        this.client.distubeAddon.on("disconnect", async (queue: Queue) => {
            if (this.client.nowPlayingMessages[queue.id]) this.client.nowPlayingMessages[queue.id]?.delete().catch(error => {});
            if (this.client.latestMusicQueueMessages[queue.id]) this.client.latestMusicQueueMessages[queue.id]?.delete().catch(error => {});
        })

    }
}