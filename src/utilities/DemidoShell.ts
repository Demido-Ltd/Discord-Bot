import { type Client } from "discord.js";
import readline from "node:readline";

export default class DemidoShell {
    private client: Client;
    private rl;

    private parseCommand = async (command: string): Promise<{ commands: string[]; options: { [key: string]: string | null } }> => {
        const words = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

        const result = {
            commands: [] as string[],
            options: {} as { [key: string]: string | null }
        };

        const length = words.length;

        if (length === 0) {
            console.error("No command provided.");
            return result;
        }

        for (let i = 0; i < length; i++) {
            const currentWord = words[i];

            if (currentWord.startsWith('--')) {
                const key = currentWord.slice(2).replace(/-/g, "_");
                if (i + 1 < length && !words[i + 1].startsWith('--')) {
                    result.options[key] = words[++i].replace(/^"|"$/g, '');
                } else {
                    result.options[key] = null;
                }
            } else {
                result.commands.push(currentWord.replace(/(^"|"$)/g, ''));
            }
        }

        return result;
    }

    constructor(client: Client) {
        this.client = client;
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        const promptUser = () => {
            this.rl.question(process.env.CLI_PREFIX!, async (command) => {
                let cmd = await this.parseCommand(command.trim().replace(/\s+/g, ' '));
                const closingStrings = ["exit", "quit", "stop", "q", "cancel", "logout", "signout"];

                const mainCommand = cmd.commands.at(0);
                if (!mainCommand) return;
                if (typeof (this as any)[mainCommand] !== "function") {
                    await this.default(mainCommand);
                    return promptUser();
                }
                if (closingStrings.includes(mainCommand)) return this.exit();

                await (this as any)[mainCommand](...cmd.commands.slice(1), cmd.options);
                promptUser();
            });
        };

        promptUser();
    }

    private exit = async () => {
        console.log("Logging out...");
        await this.client.destroy();
        this.rl.close();
    }

    private clear = async (): Promise<void> => console.clear();

    private help = async (subcommand: string = ""): Promise<void> => console.log("TODO: Write the \"help\" command" + (subcommand.length > 0 ? ` for ${subcommand}` : ""));

    private send = async (type: string, ...args: string[]): Promise<void> => {
        const options = args.pop();
    };

    private default = async (command: string) => console.log(`There is no command named \`${command}\`.\nCheck "help" for more information.`);
}
