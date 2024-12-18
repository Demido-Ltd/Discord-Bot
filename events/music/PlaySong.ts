import EmbedsArchive from "../../utilities/EmbedsArchive.ts";
import {CustomDisTube, type Demido} from "../../DiscordBot.ts";
import ButtonsArchive from "../../utilities/ButtonsArchive.ts";

export default {
    type: "playSong",
    execute: async (client: Demido, ...args: any) => {
        const embedData = EmbedsArchive.musicPlayer(args[1]);
        const attachments = [];
        if (embedData.attachments.length > 0) attachments.push(...embedData.attachments);
        if (args[0].repeatMode > 0) return;
        const message = await args[0].textChannel.send({embeds: [embedData.embed], components: ButtonsArchive.player(), files: attachments.length > 0 ? attachments : null});
        ((message.client as Demido).distube as CustomDisTube).nowPlayingMessages.set(args[0].id, message);
    }
}
