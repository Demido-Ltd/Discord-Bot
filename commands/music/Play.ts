import {
    SlashCommandBuilder,
    type GuildMember,
    type VoiceBasedChannel,
    ChatInputCommandInteraction,
    type GuildTextBasedChannel
} from 'discord.js';
import type { Demido } from "../../DiscordBot.ts";
import EmbedsArchive from "../../utilities/EmbedsArchive.ts";

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('📻 Play your favorite music')
    .addStringOption(option => option
        .setName("query")
        .setDescription("Name or link of the song")
        .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const query = interaction.options.getString("query", true);

    if (query.length < 6) {
        return interaction.reply({ embeds: [EmbedsArchive.genericErrorMessage({
            title: "Query is too short",
            description: "Your query must be longer than 5 characters.",
            emoji: "🚫",
            reportToDevs: false,
            consoleLog: false
        })] });
    }

    const client = interaction.client as Demido;
    if (!client.distube) {
        return interaction.reply({ embeds: [EmbedsArchive.genericErrorMessage({
            title: "Something went wrong",
            description: "The music player has not been initialized. Music playback is unavailable."
        })] });
    }

    const member = interaction.member as GuildMember;
    if (!member || !member.voice.channel) {
        return interaction.reply({ embeds: [EmbedsArchive.genericErrorMessage({
                title: "You are not in a Voice Channel",
                description: "Join a voice channel to play music.",
                emoji: "⚠️",
                reportToDevs: false,
                consoleLog: false
            })] });
    }

    const voiceChannel = member.voice.channel as VoiceBasedChannel;

    try {
        await client.distube.play(voiceChannel, query, {
            textChannel: interaction.channel as GuildTextBasedChannel,
            member: member,
        });
        return interaction.deleteReply();
    } catch (error) {
        return interaction.reply({ embeds: [EmbedsArchive.genericErrorMessage({
            title: "Something went wrong",
            description: "An error has occurred while trying to play music."
        })] });
    }
}
