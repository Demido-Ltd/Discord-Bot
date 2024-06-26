import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {existsSync} from "fs";
import {
    ApplicationCommandOptionType,
    AttachmentBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
} from "discord.js";

/**
 * Represents the /avatar command of the bot.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Avatar extends Command {
    /**
     * @constructor
     * Initializes the {@link Avatar} class.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'avatar',
            description: '🖼️ | Shows the specified user\'s avatar.',
            category: Category.Games,
            default_member_permissions: PermissionsBitField.Flags.AttachFiles,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "user",
                    description: "The user you want the avatar of",
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: "ephemeral",
                    description: "If \"true\" only you are allowed to see the message with the avatar.",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false
                }]
        });
    }

    /**
     * Executes the code for the /avatar command.
     * @param {ChatInputCommandInteraction} interaction - The interaction with the command.
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({embeds: [
            new EmbedBuilder().setColor("Green").setTitle(interaction.options.getUser("user")!.displayName + "'s Avatar")
                .setImage(interaction.options.getUser("user")!.displayAvatarURL({extension: "png", forceStatic: false, size: 1024 }))],
            ephemeral: interaction.options.getBoolean("ephemeral") !== null && interaction.options.getBoolean("ephemeral") as boolean});
    }

    //TODO: Add an upscaling option
}
