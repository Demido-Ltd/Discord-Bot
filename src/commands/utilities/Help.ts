import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
} from "discord.js";

/**
 * Represents the "/help" command
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Help extends Command {
    /**
     * @constructor
     * Initializes the {@link Help} class.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'help',
            description: '❓ Do you need any?',
            category: Category.Games,
            default_member_permissions: PermissionsBitField.Flags.AttachFiles,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    /**
     * Executes the code for the /help command.
     * @param {ChatInputCommandInteraction} interaction - The interaction with the command.
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({embeds: [new EmbedBuilder()
                .setTitle("❓ Help")
                .setDescription("Demido is a really simple bot. You can see all the commands and what they do by just typing \"/\" in chat.\n\nYou can check all the commands, what they do and how to use them on [the GitHub page](https://github.com/Demido-Ltd/Discord-Bot#how-to-use).")
            ], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setURL("https://github.com/Demido-Ltd/Discord-Bot#how-to-use").setLabel("How to use").setStyle(ButtonStyle.Link)
            )]});
    }
}
