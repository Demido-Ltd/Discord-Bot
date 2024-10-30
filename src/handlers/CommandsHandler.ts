import {
    REST,
    Routes,
    Client,
    type CommandInteraction
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import type {Demido} from "../index.ts";

export default class CommandsHandler {

    private client:Client;

    constructor(client: Client) {
        this.client = client;

        this.loadCommands().then(() => {
            client.on('interactionCreate', async (interaction) => {
                if (interaction.isCommand()) await this.handleCommandInteraction(interaction);
            }); // Gets executed whenever an interaction gets triggered.
        });
    }

    private loadCommands = async () => {
        const commands = [];
        const commandsPath = path.join(__dirname, '../commands');

        const folders = fs.readdirSync(commandsPath);
        for (const folder of folders) {
            const folderPath = path.join(commandsPath, folder);
            if (fs.statSync(folderPath).isDirectory()) {
                const files = fs.readdirSync(folderPath);
                for (const file of files) {
                    if (file.endsWith('.ts') || file.endsWith('.js')) {
                        const command = require(path.join(folderPath, file));
                        if (command.data) {
                            commands.push(command.data.toJSON());
                            // @ts-ignore
                            this.client.commands.set(command.data.name, command);
                        }
                    }
                }
            }
        }

        // Using REST API to register commands
        try {
            await new REST({version: '10'}).setToken(process.env.TOKEN!).put(Routes.applicationCommands(this.client.user!.id), {body: commands});
        } catch (error) {
            console.error(error);
        }
    }

    private handleCommandInteraction = async (interaction: CommandInteraction) => {
        const command = (interaction.client as Demido).commands.get(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                await interaction.reply({ content: 'Error executing command!', ephemeral: true });
            }
        }
    }
}
