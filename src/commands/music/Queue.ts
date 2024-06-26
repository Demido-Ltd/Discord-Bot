import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ChatInputCommandInteraction, InteractionResponse,
    Message,
    PermissionsBitField,
} from "discord.js";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";
import MusicQueueManager from "../../utilities/MusicQueueManager";

/**
 * Queue command to show the current music queue.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Queue extends Command {

    /**
     * @constructor
     * Creates an instance of the Queue command.
     * @param {CustomClient} client - The custom client instance
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'queue',
            description: '📝 | Shows the current queue list.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    /**
     * Executes the queue command.
     * @param {ChatInputCommandInteraction} interaction - The interaction that triggered the command.
     * @returns {Promise<void | InteractionResponse<boolean>>}
     */
    async Execute(interaction: ChatInputCommandInteraction): Promise<void | InteractionResponse<boolean>> {
        await interaction.deferReply();
        if (this.client.distubeAddon.getQueue(interaction.guild!.id)!.songs.length <= 1)
            return await interaction.reply({content: "⚠️ There is only one song in the current queue, and it is playing now.", ephemeral: true});
        new MusicQueueManager(this.client, interaction.guild!.id).delete();
        const messageEmbedAndComponents = EmbedMessagesArchive.queue(this.client.distubeAddon.getQueue(interaction.guild!.id)!);
        this.client.latestMusicQueueMessages[interaction.guild!.id] = await interaction.editReply({
            embeds: [messageEmbedAndComponents.embed],
            components: messageEmbedAndComponents.components
        }) as Message<true>;
    }
}
