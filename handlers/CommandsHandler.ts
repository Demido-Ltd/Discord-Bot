import type {Demido} from "../DiscordBot.ts";
import path from "node:path";
import fs from "node:fs";
import {CommandInteraction, REST, Routes} from "discord.js";

export default class CommandsHandler {

    private client: Demido;

    constructor(client: Demido) {
        this.client = client;
        this.loadCommands().then(() => {
            client.on("interactionCreate", async (interaction) => {
                if (interaction.isCommand()) await this.handleCommandInteraction(interaction);
            });
        });
    }

    private loadCommands = async () => {
        const commands: JSON[] = [];
        const commandsDir = path.join(__dirname, "../commands");

        const loadCommandsFromDirectory = async (directory: string) => {
            const files = fs.readdirSync(directory);
            for (const file of files) {
                const filePath = path.join(directory, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) await loadCommandsFromDirectory(filePath);
                else if (file.endsWith(".ts") || file.endsWith(".ts")) {
                    const command = (await import(filePath));
                    if (command.data) {
                        commands.push(command.data.toJSON());
                        this.client.commands.set(command.data.name, command);
                    }
                }
            }
        }

        await loadCommandsFromDirectory(commandsDir)

        try {
            await new REST({version: "10"}).setToken(process.env.DISCORD_BOT_TOKEN!)
                .put(Routes.applicationCommands(this.client.user!.id), {body: commands});
        }catch (error) {
            console.error(error);
        }
    }

    private handleCommandInteraction = async (interaction: CommandInteraction) => {
        const command = (interaction.client as Demido).commands.get(interaction.commandName);
        if (command) try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            await interaction.reply({ content: 'Error executing command!', ephemeral: true });
        }
    }

}