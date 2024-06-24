import CustomClient from "../base/classes/CustomClient";
import EmbedMessagesArchive from "./EmbedMessagesArchive";
import NumbersManipulation from "./NumbersManipulation";

export default class MusicQueueManager {

    client: CustomClient;
    guildId: string;

    constructor(client: CustomClient, guildId: string) {
        this.client = client;
        this.guildId = guildId;
    }

    static currentlySelectedPage(client: CustomClient, guildId: string, returnAsString: boolean = false): number | string {
        const lmqm = client.latestMusicQueueMessages[guildId];
        let value = "0"
        // @ts-ignore
        if (lmqm && lmqm.components[1] && lmqm.components[1].components[1] && lmqm.components[1].components[1].data["label"])
            // @ts-ignore
            value = lmqm.components[1].components[1].data["label"].replace(/\s+/g, "").split("/");
        if (returnAsString) return value;
        return parseInt(value);
    }

    update = async () => {
        const latestMusicQueueMessageData = EmbedMessagesArchive.queue(
            this.client.distubeAddon.getQueue(this.guildId)!,
            MusicQueueManager.currentlySelectedPage(this.client, this.guildId) as number
        );
        await this.client.latestMusicQueueMessages[this.guildId]!.edit({
            embeds: [latestMusicQueueMessageData.embed],
            components: latestMusicQueueMessageData.components
        });
    }

    delete = () => {
        this.client.latestMusicQueueMessages[this.guildId]?.delete().catch(error => {});
        this.client.latestMusicQueueMessages[this.guildId] = null;
    }

}