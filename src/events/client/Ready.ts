import "dotenv/config";
import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import { Collection, Events, REST, Routes } from "discord.js";
import Command from "../../base/classes/Command";

/**
 * Represents the Ready event, triggered when the client becomes ready to start working.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Ready extends Event {
    /**
     * @constructor
     * Creates an instance of the Ready event.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Gets triggered when the bot is ready.",
            once: true,
        });
    }

    /**
     * Executes the Ready event.
     */
    async Execute() {
        console.log(`✅ | ${this.client.user?.tag} is now ready!`);

        // Initialize REST with the bot token.
        const rest = new REST().setToken(process.env.TOKEN!);

        // Retrieve the client ID based on whether it's in development mode or not.
        const clientId = this.client.developmentMode ? this.client.config.devDiscordClientId : this.client.config.discordClientId;

        // Set global application commands if not in development mode.
        if (!this.client.developmentMode) {
            try {
                const globalCommands: any = await rest.put(Routes.applicationCommands(clientId), {
                    body: this.GetJson(this.client.commands.filter(command => !command.dev)),
                });
                console.log(`✅ | Successfully loaded ${globalCommands.length} global application (/) commands.`);
            } catch (error) {
                console.error(`❌ | An error occurred while trying to set the global application (/) commands!`);
                console.error(error);
            }
        }

        // Set developer application commands.
        try {
            const devCommands: any = await rest.put(Routes.applicationGuildCommands(clientId, this.client.config.devGuildId), {
                body: this.GetJson(this.client.commands.filter(command => command.dev)),
            });
            console.log(`✅ | Successfully set ${devCommands.length} developer application (/) commands!`);
        } catch (error) {
            console.error(`❌ | An error occurred while trying to set the developer application (/) commands!`);
            console.error(error);
        }
    };

    /**
     * Converts a collection of commands into JSON format.
     * @param {Collection<string, Command>} commands - The collection of commands.
     * @returns {object[]} An array of command objects in JSON format.
     * @private
     */
    private GetJson(commands: Collection<string, Command>): object[] {
        const data: object[] = [];
        commands.forEach((command) => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options,
                default_member_permissions: command.default_member_permissions.toString(),
                dm_permission: command.dm_permission,
            });
        });

        return data;
    }
}
