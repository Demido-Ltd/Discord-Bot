import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import type { CustomDisTube, Demido } from '../../DiscordBot';
import ButtonsArchive from '../../utilities/ButtonsArchive';

export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the currently playing song');

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    
    const distube = (interaction.client as Demido).distube as CustomDisTube;
    const queue = distube.getQueue(interaction.guildId!);
    
    if (!queue) return interaction.followUp({ content: "No music is currently playing.", ephemeral: true }); // TODO: Use embed

    if (queue.paused)
        return interaction.followUp({ content: "Music is already paused.", ephemeral: true }); // TODO: Use embed
    await distube.pause(interaction.guildId!);
    
    const updatedComponents = ButtonsArchive.player(false, queue.repeatMode > 0);
    await distube.nowPlayingMessages.get(queue.id)!.edit({ components: updatedComponents });
    await interaction.deleteReply();
}
