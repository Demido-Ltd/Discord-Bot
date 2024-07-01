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
 *
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
            name: 'info',
            description: 'Some info',
            category: Category.Games,
            default_member_permissions: PermissionsBitField.Flags.AttachFiles,
            dm_permission: true,
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
                .setTitle("Hello there! 👋")
                .setDescription("🙏 Thank you for taking the time to check out this section of the bot.\nDemido is a " +
                    "project born out of boredom and passion for programming.\nWe tried to make the bot that we " +
                    "always wanted to see out there but were never able to find.\n\n🖋️ The bot is written in " +
                    "TypeScript and is available on [GitHub](https://github.com/Demido-Ltd/Discord-Bot).\n" +
                    "The project is based on two main libraries, namely [Discord.JS](https://discord.js.org/) and " +
                    "[DisTube](https://github.com/skick1234/DisTube).\n\n😁 We hope the project will continue to grow " +
                    "and we will keep updating it with new features as long as we can.\n\nSpecial thanks go to " +
                    "<@386602397893656576> as they've helped with math-related problems.")
            ],
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder().setLabel("📖 Read more!").setStyle(ButtonStyle.Link).setURL("https://github.com/Demido-Ltd/Discord-Bot")])
        ], ephemeral: true});
    }
}
