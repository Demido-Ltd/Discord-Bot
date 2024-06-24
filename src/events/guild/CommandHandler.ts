import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import { ChatInputCommandInteraction, Collection, EmbedBuilder, Events } from "discord.js";
import Command from "../../base/classes/Command";

/**
 * Handles interactions with chat input commands.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class CommandHandler extends Event {
    /**
     * Creates an instance of the CommandHandler event.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Command Handler Event",
            once: false,
        });
    }

    /**
     * Executes the CommandHandler event.
     * @param {ChatInputCommandInteraction} interaction - The interaction with the command.
     */
    Execute(interaction: ChatInputCommandInteraction) {
        // Ignore if the interaction is not a chat input command.
        if (!interaction.isChatInputCommand()) return;

        // Retrieve the command object based on the command name.
        const command: Command = this.client.commands.get(interaction.commandName)!;

        //@ts-ignore
        // If the command doesn't exist, reply with an error message and remove the interaction's command name from the client's commands.
        if (!command) return interaction.reply({ content: "❌ | This command does not exist!", ephemeral: true }) && this.client.commands.delete(interaction.commandName);

        // If the command is restricted to developers and the user is not a developer, reply with an error message.
        if (command.dev && !this.client.config.developerUsers.includes(interaction.user.id)) {
            return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("❌ | This command can only be used by the developers.")
                ], ephemeral: true });
        }

        // Handle command cooldowns.
        const { cooldowns } = this.client;
        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(interaction.user.id) && (now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount))
            return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ | Please wait another \`${((((timestamps.get(interaction.user.id) || 0) + cooldownAmount) - now) / 1000).toFixed(1)}\` seconds to run this command.`)], ephemeral: true });

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            // Determine if the command has subcommands, and execute accordingly.
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subCommand = `${interaction.commandName}${subCommandGroup ? `${subCommandGroup}` : ""}.${interaction.options.getSubcommand(false) || ""}`;
            return this.client.subCommands.get(subCommand)?.Execute(interaction) || command.Execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
}
