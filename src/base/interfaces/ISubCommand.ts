import CustomClient from "../classes/CustomClient";
import {ChatInputCommandInteraction} from "discord.js";

export default interface ISubCommand {
    client: CustomClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}