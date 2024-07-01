import CustomClient from "../base/classes/CustomClient";
import {ButtonInteraction, EmbedBuilder, Guild, Message} from "discord.js";
import MusicQueueManager from "../utilities/MusicQueueManager";
import EmbedMessagesArchive from "../utilities/EmbedMessagesArchive";

/**
 * This function shuffles the currently playing queue.
 * @param {CustomClient} client The bot client
 * @param {ButtonInteraction} interaction The Button Interaction
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default async function shuffle_queue(client: CustomClient, interaction: ButtonInteraction) {
    const guild: Guild | undefined = client.guilds.cache.get(interaction.guild!.id);
    const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;

    if (userVoiceChannel !== guild!.members.cache.get(client.user!.id)!.voice.channel) {
        return interaction.reply({embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`❌ | You need to be in ${guild!.members.cache.get(client.user!.id)!.voice.channel} if you want to shuffle the queue.`)
            ], ephemeral: true});
    }
    await interaction.deferUpdate();
    client.distubeAddon.getQueue(interaction.guild!.id)?.shuffle().catch(error => {}).then(queue => {
        new MusicQueueManager(client, interaction.guild!.id).update();
    });

}