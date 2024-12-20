import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import type {CustomDisTube, Demido} from "../../DiscordBot.ts";

export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows you the current queue of songs.');

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({ content: "No music is currently playing.", ephemeral: true }); // TODO: Use embed

    await interaction.followUp("Not yet available")

}
