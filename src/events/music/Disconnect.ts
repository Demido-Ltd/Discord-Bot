import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import ButtonsArchive from "../../utilities/ButtonsArchive";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";
import {Queue, Song} from "distube";

export default class Disconnect extends Event {

    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Play Event",
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