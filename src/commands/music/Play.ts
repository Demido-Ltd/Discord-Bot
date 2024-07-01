import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    EmbedBuilder, Guild,
    PermissionsBitField,
} from "discord.js";

/**
 * Represents the /play command.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Play extends Command {

    /**
     * @constructor
     * Constructor for the PlaySong class.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'play',
            description: '▶️ | Plays a song of your choice.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: [{
                name: "song",
                description: "The song you want to be played.",
                type: ApplicationCommandOptionType.String,
                required: true
            }]
        });
    }

    /**
     * Execute method to handle the logic when the command is invoked.
     * @param {ChatInputCommandInteraction} interaction - The interaction object from discord.js
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        const guild: Guild | undefined = this.client.guilds.cache.get(interaction.guild!.id);

        const userVoiceChannel = guild!.members.cache.get(interaction.member!.user.id)!.voice.channel;
        if (!userVoiceChannel) return interaction.reply({embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription("❌ | You must be in a voice channel if you want to listen to music.")
            ], ephemeral: true});
        if (userVoiceChannel !== guild!.members.cache.get(this.client.user!.id)!.voice.channel) {
            return interaction.reply({embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ | Music is already playing in ${guild!.members.cache.get(this.client.user!.id)!.voice.channel}.`)
                ], ephemeral: true});
        }
        await interaction.deferReply();
        // @ts-ignore
        await this.client.distubeAddon.play(userVoiceChannel, interaction.options.getString("song")!, {textChannel: interaction.channel, member: interaction.member});
        await interaction.deleteReply();

    }
}
