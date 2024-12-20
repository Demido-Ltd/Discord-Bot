import type {Demido} from "../DiscordBot.ts";
import path from "node:path";
import fs from "node:fs";
import {CommandInteraction, REST, Routes} from "discord.js";

/**
 * Handles loading and executing commands for the Discord bot.
 * This class is responsible for loading all available commands from the file system,
 * registering them with Discord's API, and processing command interactions from users.
 */
export default class CommandsHandler {

    private client: Demido;

    /**
     * Initializes the CommandsHandler and loads commands on bot startup.
     * Also listens for interaction events and handles them.
     *
     * @param {Demido} client - The Discord bot client instance.
     */
    constructor(client: Demido) {
        this.client = client;
        this.loadCommands().then(() => {
            client.on("interactionCreate", async (interaction) => {
                if (interaction.isCommand()) await this.handleCommandInteraction(interaction);
            });
        });
    }

    /**
     * Loads all commands from the commands directory and registers them with Discord's API.
     * Also adds each command to the client's command collection for later execution.
     *
     * @returns {Promise<void>} A promise that resolves when the commands are loaded.
     */
    private loadCommands = async (): Promise<void> => {
        const commands: JSON[] = [];
        const commandsDir = path.join(__dirname, "../commands");

        /**
         * Recursively loads commands from the specified directory and its subdirectories.
         *
         * @param {string} directory - The directory to load commands from.
         * @returns {Promise<void>} A promise that resolves when the commands are loaded.
         */
        const loadCommandsFromDirectory = async (directory: string) => {
            const files = fs.readdirSync(directory);
            for (const file of files) {
                if (file === "music" && !process.env.MUSIC) continue;
                const filePath = path.join(directory, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) await loadCommandsFromDirectory(filePath);
                else if (file.endsWith(".ts")) {
                    const command = (await import(filePath));
                    if (command.data) {
                        commands.push(command.data.toJSON());
                        this.client.commands.set(command.data.name, command);
                    }
                }
            }
        }

        await loadCommandsFromDirectory(commandsDir);

        try {
            await new REST({version: "10"}).setToken(process.env.DISCORD_BOT_TOKEN!)
                .put(Routes.applicationCommands(this.client.user!.id), {body: commands});
        }catch (error) {
            console.error(error);
        }
    }

    /**
     * Handles a command interaction from a user. Executes the corresponding command if available.
     *
     * @param {CommandInteraction} interaction - The interaction object representing the user's command.
     *
     * @returns {Promise<void>} A promise that resolves when the command is executed.
     */
    private handleCommandInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const command = (interaction.client as Demido).commands.get(interaction.commandName);
        if (command) try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            await interaction.reply({ content: 'Error executing command!', ephemeral: true }); // TODO: Update error with embed
        }
    }

}