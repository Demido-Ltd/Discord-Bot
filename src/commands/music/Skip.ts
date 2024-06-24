import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ChatInputCommandInteraction,
    PermissionsBitField,
} from "discord.js";
import MusicQueueManager from "../../utilities/MusicQueueManager";


export default class Skip extends Command {

    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'skip',
            description: '🎵 | Skips the current song.',
            category: Category.Music,
            default_member_permissions: PermissionsBitField.Flags.Speak,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild!;
        await interaction.deferReply();
        await interaction.deleteReply();
        if (this.client.distubeAddon.getQueue(guild.id)!.songs.length <= 1) {
            new MusicQueueManager(this.client, interaction.guild!.id).delete();
            return await this.client.distubeAddon.stop(guild.id);
        }
        await this.client.distubeAddon.skip(guild);
        await new MusicQueueManager(this.client, interaction.guild!.id).update();
    }
}
