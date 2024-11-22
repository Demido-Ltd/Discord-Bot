import type {Demido} from "../DiscordBot.ts";
import path from "node:path";
import fs from "node:fs";
import type {ButtonInteraction} from "discord.js";

// TODO: Add documentation
export default class ButtonsHandler {
    private client: Demido;

    constructor(client: Demido) {
        this.client = client;
        this.loadButtons().then(() => {
            client.on("interactionCreate", async (interaction) => {
                if (interaction.isButton()) await this.handleButtonInteraction(interaction);
            })
        })
    }

    private loadButtons = async () => {
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

    private handleButtonInteraction = async (interaction: ButtonInteraction) => {
        const button = (interaction.client as Demido).buttons.get(interaction.customId);
        if (button) try {
            await button.execute(interaction);
        } catch (error) {
            console.error(`Error executing button ${interaction.customId}:`, error);
            await interaction.reply({ content: 'Error executing button!', ephemeral: true });  // TODO: Update error with embed
        }
    }

}