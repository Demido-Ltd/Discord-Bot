import {ButtonInteraction, EmbedBuilder, Guild} from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import ButtonsArchive from "../utilities/ButtonsArchive";
import EmbedMessagesArchive from "../utilities/EmbedMessagesArchive";


/**
 * This function pauses the currently playing song or queue.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function pause_queue (client: CustomClient, interaction: ButtonInteraction) {
    const guild: Guild | undefined = client.guilds.cache.get(interaction.guild!.id);
    const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;

    if (userVoiceChannel !== guild!.members.cache.get(client.user!.id)!.voice.channel) {
        return interaction.reply({embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`❌ | You need to be in ${guild!.members.cache.get(client.user!.id)!.voice.channel} if you want to pause the music.`)
            ], ephemeral: true});
    }
    await client.nowPlayingMessages[interaction.guild!.id]!.edit({
        embeds: [await EmbedMessagesArchive.musicPlayerEmbed(client.distubeAddon.getQueue(interaction.guild!.id)!.songs[0], true, interaction)],
        components: ButtonsArchive.musicPlayerControls(true, client.distubeAddon.getQueue(interaction.guild!.id)!.songs[0])
    });
    await interaction.deferUpdate();
    client.distubeAddon.pause(interaction.guild!.id);
}