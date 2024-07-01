import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ChatInputCommandInteraction, EmbedBuilder, Guild,
    PermissionsBitField,
} from "discord.js";
import MusicQueueManager from "../../utilities/MusicQueueManager";

/**
 * Command to stop music playback and clear the music queue.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Stop extends Command {

    /**
     * @constructor
     * Creates an instance of Stop command.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'stop',
            description: '⏹️ | Stops the music and deletes the queue.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    /**
     * Executes the stop command to halt music playback, clear queue, and clean up related messages.
     * @param {ChatInputCommandInteraction} interaction - The interaction object representing the command invocation.
     * @returns
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        const guild: Guild | undefined = this.client.guilds.cache.get(interaction.guild!.id);
        const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;

        if (userVoiceChannel !== guild!.members.cache.get(this.client.user!.id)!.voice.channel) {
            return interaction.reply({embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ | You need to be in ${guild!.members.cache.get(this.client.user!.id)!.voice.channel} if you want to stop the music.`)
                ], ephemeral: true});
        }
        await this.client.distubeAddon.stop(interaction.guild!);
        await interaction.deferReply();
        await interaction.deleteReply();
        await this.client.nowPlayingMessages[interaction.guild!.id]?.delete().catch(error => {});
        this.client.nowPlayingMessages[interaction.guild!.id] = null;
        new MusicQueueManager(this.client, interaction.guild!.id).delete();
    }
}
