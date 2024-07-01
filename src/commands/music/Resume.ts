import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ChatInputCommandInteraction, EmbedBuilder, Guild,
    PermissionsBitField,
} from "discord.js";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";
import ButtonsArchive from "../../utilities/ButtonsArchive";

/**
 * Represents the '/resume' command which resumes the current music queue.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Resume extends Command {

    /**
     * @constructor
     * Creates an instance of the Resume command.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'resume',
            description: '▶️ | Resumes the current queue.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    /**
     * Executes the Resume command to resume the current music queue.
     * @param {ChatInputCommandInteraction} interaction - The command interaction.
     * @returns
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        const guild: Guild | undefined = this.client.guilds.cache.get(interaction.guild!.id);
        const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;

        if (userVoiceChannel !== guild!.members.cache.get(this.client.user!.id)!.voice.channel) {
            return interaction.reply({embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ | You need to be in ${guild!.members.cache.get(this.client.user!.id)!.voice.channel} if you want to resume the music playback.`)
                ], ephemeral: true});
        }
        await this.client.nowPlayingMessages[interaction.guild!.id]!.edit({
            embeds: [await EmbedMessagesArchive.musicPlayerEmbed(this.client.distubeAddon.getQueue(interaction.guild!)!.songs[0])],
            components: ButtonsArchive.musicPlayerControls(false, this.client.distubeAddon.getQueue(interaction.guild!.id)!.songs[0])});
        this.client.distubeAddon.resume(interaction.guild!);
        await interaction.deferReply();
        await interaction.deleteReply();
    }
}
