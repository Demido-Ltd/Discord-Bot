import type {Demido} from "../DiscordBot.ts";
import path from "node:path";
import fs from "node:fs";
import type {ButtonInteraction} from "discord.js";

/**
 * Handles interactions with buttons in a Discord bot.
 * This class loads button files from a directory and manages the execution of button interactions.
 */
export default class ButtonsHandler {
    private client: Demido;

    /**
     * Creates an instance of ButtonsHandler.
     * Initializes button loading and sets up the interaction listener for button interactions.
     *
     * @param {Demido} client - The bot client instance to be used for loading buttons and handling interactions.
     */
    constructor(client: Demido) {
        this.client = client;
        this.loadButtons().then(() => {
            client.on("interactionCreate", async (interaction) => {
                if (interaction.isButton()) await this.handleButtonInteraction(interaction);
            })
        })
    }

    /**
     * Loads button files from the 'buttons' directory and adds them to the client's buttons collection.
     * This method recursively loads buttons from subdirectories and imports the button files.
     * Buttons are only loaded if they meet certain conditions (e.g., only loading music-related buttons if the MUSIC environment variable is set).
     *
     * @returns {Promise<void>} A promise that resolves once all buttons have been loaded.
     *
     * @private
     */
    private loadButtons = async (): Promise<void> => {
        const buttonsDir = path.join(__dirname, "../buttons");

        const loadButtonsFromDirectory = async (directory: string) => {
            const files = fs.readdirSync(directory);
            for (const file of files) {
                if (file === "music" && !process.env.MUSIC) continue;
                const filePath = path.join(directory, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) await loadButtonsFromDirectory(filePath);
                else if (file.endsWith("ts")) {
                    const button = (await import(filePath));
                    if (button.data) this.client.buttons.set(button.data.id, button);
                }
            }
        }

        await loadButtonsFromDirectory(buttonsDir);
    }

    /**
     * Handles button interactions by executing the corresponding button logic.
     * If an error occurs while executing the button, an error message is sent to the user.
     *
     * @param {ButtonInteraction} interaction - The button interaction received from Discord.
     *
     * @returns {Promise<void>} A promise that resolves once the button interaction has been processed.
     *
     * @private
     */
    private handleButtonInteraction = async (interaction: ButtonInteraction): Promise<void> => {
        const button = (interaction.client as Demido).buttons.get(interaction.customId);
        if (button) try {
            await button.execute(interaction);
        } catch (error) {
            console.error(`Error executing button ${interaction.customId}:`, error);
            await interaction.reply({ content: 'Error executing button!', ephemeral: true });  // TODO: Update error with embed
        }
    }

}