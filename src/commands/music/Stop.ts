import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ChatInputCommandInteraction,
    PermissionsBitField,
} from "discord.js";
import MusicQueueManager from "../../utilities/MusicQueueManager";

export default class Stop extends Command {

    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'stop',
            description: '🎵 | Stops the music and deletes the queue.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {

        await this.client.distubeAddon.stop(interaction.guild!);
        await interaction.deferReply();
        await interaction.deleteReply();
        await this.client.nowPlayingMessages[interaction.guild!.id]?.delete().catch(error => {});
        this.client.nowPlayingMessages[interaction.guild!.id] = null;
        new MusicQueueManager(this.client, interaction.guild!.id).delete();



    }
}
