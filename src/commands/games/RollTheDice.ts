import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {existsSync} from "fs";
import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
} from "discord.js";

/**
 * Represents a command to roll a die.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class RollTheDice extends Command {
    /**
     * Creates an instance of the RollTheDice command.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'rollthedice',
            description: 'Rolls a dice.',
            category: Category.Games,
            default_member_permissions: PermissionsBitField.Flags.SendMessages,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: []
        });
    }

    /**
     * Executes the RollTheDice command.
     * @param {ChatInputCommandInteraction} interaction - The interaction with the command.
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        // Generate a random number between 1 and 6 and reply with an embed.
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(existsSync(`./data/assets/games/rollthedice/dice${randomNumber}.png`));
        const diceImage = new AttachmentBuilder(`./data/assets/games/rollthedice/dice${randomNumber}.png`)
        await interaction.reply({embeds: [new EmbedBuilder()
            .setColor("Green")
            .setTitle("Roll The Dice!")
            .setDescription(`🎲 A dice has been rolled!\n\n\`${randomNumber}\` has come up.`)
            .setThumbnail(`attachment://dice${randomNumber}.png`)
        ], files: [diceImage]});
    }
}
