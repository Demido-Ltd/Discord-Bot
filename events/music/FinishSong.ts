import {CustomDisTube, type Demido} from "../../DiscordBot.ts";

export default {
    type: "finishSong",
    execute: async (client: Demido, ...args: any) => {
        try { await (client.distube as CustomDisTube).nowPlayingMessages.get(args[0].id)?.delete(); } catch (error) {}
    }
}