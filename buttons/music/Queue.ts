import {ButtonInteraction} from "discord.js";
import ButtonsArchive from "../../utilities/ButtonsArchive.ts";
import {CustomDisTube, type Demido} from "../../DiscordBot.ts";
import EmbedsArchive from "../../utilities/EmbedsArchive.ts";

// TODO: Add documentation
export const data = {
    id: "music.queue",
};

export const execute = async (interaction: ButtonInteraction) => {
    await interaction.deferUpdate();
    await interaction.followUp({embeds: [EmbedsArchive.genericProcessMessage({
            title: "Function not yet available",
            description: "The queue function is still under development and it is not yet available for usage.\nWe are sorry for the inconvenience."
    })], ephemeral: true});
};
