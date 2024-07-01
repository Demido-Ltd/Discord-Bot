import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ChatInputCommandInteraction, EmbedBuilder, Guild,
    PermissionsBitField,
} from "discord.js";
import MusicQueueManager from "../../utilities/MusicQueueManager";

/**
 * Skip Command class to handle the skipping of the current song in the queue.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Skip extends Command {

    /**
     * @constructor
     * Constructs the Skip command.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'skip',
            description: '⏩ | Skips the current song.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    /**
     * Executes the Skip command.
     * @param {ChatInputCommandInteraction} interaction - The interaction that triggered the command.
     * @returns
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        const guild: Guild | undefined = this.client.guilds.cache.get(interaction.guild!.id);
        const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;

        if (userVoiceChannel !== guild!.members.cache.get(this.client.user!.id)!.voice.channel) {
            return interaction.reply({embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ | You need to be in ${guild!.members.cache.get(this.client.user!.id)!.voice.channel} if you want to skip this song.`)
                ], ephemeral: true});
        }
        await interaction.deferReply();
        await interaction.deleteReply();
        if (this.client.distubeAddon.getQueue(guild!.id)!.songs.length <= 1) {
            new MusicQueueManager(this.client, interaction.guild!.id).delete();
            return await this.client.distubeAddon.stop(guild!.id);
        }
        await this.client.distubeAddon.skip(guild!);
        await new MusicQueueManager(this.client, interaction.guild!.id).update();
    }
}
