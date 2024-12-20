import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import {CustomDisTube, type Demido} from "../../DiscordBot.ts";

export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music');

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ephemeral: true});

    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);

    if (!queue) return interaction.followUp({content: "No music is currently playing.", ephemeral: true}); // TODO: Use embed
    await queue.stop();
    await distube.nowPlayingMessages.get(interaction.guild!.id)?.delete();
    distube.nowPlayingMessages.delete(interaction.guild!.id);
    await interaction.deleteReply();
}
