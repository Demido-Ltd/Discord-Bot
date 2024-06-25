import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ChatInputCommandInteraction,
    PermissionsBitField,
} from "discord.js";
import ButtonsArchive from "../../utilities/ButtonsArchive";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";

/**
 * Represents a command to pause the current music queue.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Pause extends Command {

    /**
     * @constructor
     * The constructor for the Pause class.
     * @param {CustomClient} client - The bot client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'pause',
            description: '🎵 | Pauses the current queue.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    /**
     * The execute method for the Pause command. This method is called when the command is received.
     * @param {ChatInputCommandInteraction} interaction - The interaction object representing the command interaction
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        await this.client.nowPlayingMessages[interaction.guild!.id]!.edit({
            embeds: [await EmbedMessagesArchive.musicPlayerEmbed(this.client.distubeAddon.getQueue(interaction.guild!.id)!.songs[0], true, interaction)],
            components: ButtonsArchive.musicPlayerControls(true, this.client.distubeAddon.getQueue(interaction.guild!.id)!.songs[0])}
        );
        this.client.distubeAddon.pause(interaction.guild!);
        await interaction.deferReply();
        await interaction.deleteReply();
    }
}
