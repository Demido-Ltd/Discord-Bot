import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {Events} from "discord.js";
import ButtonsArchive from "../../utilities/ButtonsArchive";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";

export default class Play extends Event {

    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Play Event",
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