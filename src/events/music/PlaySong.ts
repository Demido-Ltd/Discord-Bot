import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import ButtonsArchive from "../../utilities/ButtonsArchive";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";

/**
 * Event that gets triggered whenever a song starts playing.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class PlaySong extends Event {

    /**
     * @constructor
     * Initializes the {@link PlaySong} class
     * @param {CustomClient} client The bot client instance
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "PlaySong Event",
            once: true,
        });
    }

    async Execute() {

        this.client.distubeAddon.on("playSong", async (queue, song) => {
            if (this.client.nowPlayingMessages[queue.id]) return;
            this.client.nowPlayingMessages[queue.id] = await queue.textChannel!.send({
                embeds: [ await EmbedMessagesArchive.musicPlayerEmbed(song) ], components: ButtonsArchive.musicPlayerControls(false, song)
            });
        })

    }
}