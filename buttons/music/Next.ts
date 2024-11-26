import {ButtonInteraction} from "discord.js";
import {CustomDisTube, type Demido} from "../../DiscordBot.ts";
import EmbedsArchive from "../../utilities/EmbedsArchive.ts";

// TODO: Add documentation
export const data = {
    id: "music.next",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferReply();
    const distube = (interaction.client as Demido).distube
    if ((distube?.getQueue(interaction.guild!.id)!.songs.length || 0) > 1) {
        await distube?.getQueue(interaction.guild!.id)!.skip();
        await interaction.deleteReply();
    }
    else await interaction.reply({embeds: [EmbedsArchive.genericErrorMessage({
            title: "No more songs in queue",
            description: "There should be at least two songs in the queue in order to skip to the next one.\nYou can check the queue using `/queue`.",
            reportToDevs: false
        })]})
};
