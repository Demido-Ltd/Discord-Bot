import {Queue, Song} from "distube";
import ytdl from "ytdl-core";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder
} from "discord.js";
import NumbersManipulation from "./NumbersManipulation";
import CustomClient from "../base/classes/CustomClient";
import StringsManipulation from "./StringsManipulation";

export default class EmbedMessagesArchive {

    static musicPlayerEmbed = async (song:Song, isPaused: boolean = false, interaction: ButtonInteraction | ChatInputCommandInteraction | null = null) => {
        const songInfo = await ytdl.getInfo(song.id!);
        const songUploadDate = new Date(songInfo.videoDetails.uploadDate);

        if (isPaused && interaction) {
            return new EmbedBuilder()
                .setColor("Orange")
                .setTitle("Queue has been paused")
                .setDescription(`The current queue has been paused by ${interaction.member}`)
        }

        return new EmbedBuilder()
            .setTitle("Now Playing")
            .setColor("Green")
            .setDescription(`**${song.name}**`)
            .setThumbnail(song.thumbnail || "")
            .addFields([
                {
                    name: "Creator",
                    value: `[${song.uploader.name}](${song.uploader.url})` || 'Unknown',
                    inline: true
                },
                {
                    name: "Views",
                    value: NumbersManipulation.formatNumber(song.views),
                    inline: true
                },
                {
                    name: "Duration",
                    value: song.formattedDuration!.toString(),
                    inline: true},
                {
                    name: "Upload Date",
                    value: `${songUploadDate.getDate().toString().padStart(2, "0")}/${(songUploadDate.getMonth() + 1).toString().padStart(2, "0")}/${songUploadDate.getFullYear()}`,
                    inline: true
                },
                {
                    name: "Link",
                    value: `[Here](${song.url})`,
                    inline: true
                },
                {
                    name: "Requested by",
                    value: `${song.member}`,
                    inline: true
                },
            ])
            .setFooter({text: `Developed with ❤️ by elpideus.`})
    }

    static buttonNoCodeWrongID = (client: CustomClient, interaction: ButtonInteraction | null = null, developerNotification: boolean = false)=> {
        if (developerNotification && interaction)
            return new EmbedBuilder()
                .setTitle("🚫 A bug has occurred!")
                .setDescription(`An error has occurred when a user (${interaction.member}) tried clicking on a **button**.`)
                .addFields([
                    {
                        name: "Button ID",
                        value: interaction.customId,
                        inline: true
                    },
                    {
                        name: "Clicked by",
                        value: `${interaction.member}`,
                        inline: true
                    },
                    {
                        name: "Server Name",
                        value: interaction.guild!.name,
                        inline: true
                    },
                    {
                        name: "Server ID",
                        value: interaction.guild!.id,
                        inline: true
                    },
                    {
                        name: "Message ID",
                        value: `https://discord.com/channels/${interaction.guild!.id}/${interaction.channel!.id}/${interaction.message.id}`
                    }
                ])
                .setColor("Red")

        let developersList = "";
        client.config.developerUsers.forEach(developer => developersList += `<@${developer}>, `)
        return new EmbedBuilder()
            .setTitle("🚫 The button you have clicked doesn't work.")
            .setDescription(`Maybe the button code hasn't been written yet or it has a wrong ID.\nAnyway the problem has been reported to the developers (${developersList.slice(0, -2)}).`)
            .setColor("Red")
    }

    static queue = (queue: Queue, page: number = 1, elementsPerPage: number = 5) => {
        let songsList = "";
        const maximumPages = Math.ceil((queue.songs.length - 1) / elementsPerPage);
        if (page > maximumPages) page = maximumPages;
        const specificSkipButtons1 = new ActionRowBuilder<ButtonBuilder>();
        const specificSkipButtons2 = new ActionRowBuilder<ButtonBuilder>();
        // Since the first song is the currently playing song, and it is not included, the entire array is shifted by one.
        const current = (page * elementsPerPage) + 1;
        const queueSongs = queue.songs.slice(current - elementsPerPage, current);

        queueSongs.forEach((song: Song, index: number) => {
            songsList += StringsManipulation.limitStringLength(`${NumbersManipulation.numberToEmoji(index + 1)} **${song.name}** [${song.uploader.name}]`, 75) + "\n"
            if (index <= 5)
                specificSkipButtons1.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`skip_song${(page - 1) * elementsPerPage + index + 1 > 0 ? `|${(page - 1) * elementsPerPage + index + 1}` : ""}`)
                        .setLabel(NumbersManipulation.numberToEmoji(index + 1))
                        .setStyle(ButtonStyle.Secondary),
                );
            else specificSkipButtons2.addComponents(
                new ButtonBuilder()
                    .setCustomId(`skip_song${index > 0 ? "|" + index + 1 : ""}`)
                    .setLabel(NumbersManipulation.numberToEmoji(index + 1))
                    .setStyle(ButtonStyle.Secondary)
            );
        });

        // const select = new StringSelectMenuBuilder()
        //     .setCustomId('skip_to_song')
        //     .setPlaceholder('Select song')
        //     .addOptions(
        //         queueSongs.map((song, index) =>
        //             new StringSelectMenuOptionBuilder()
        //                 .setLabel(song.name!)
        //                 .setValue("skip_song|" + index.toString())
        //         )
        //     );

        let components = [specificSkipButtons1];
        if (elementsPerPage > 5 && songsList.length > 5) components.push(specificSkipButtons2);
        if (maximumPages > 1) components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("queue_previous_page")
                    .setLabel("⬅️ Previous")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId("does_nothing")
                    .setLabel(`${page} / ${maximumPages}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("queue_next_page")
                    .setLabel("Next ➡️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === maximumPages),
                new ButtonBuilder()
                    .setCustomId("shuffle_queue")
                    .setLabel("🎲 Shuffle")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(queue.songs.length < 4)
            )
        );

        return {
            embed: new EmbedBuilder()
                .setDescription(`**There are currently** \`${queue.songs.length - 1}\` **songs in queue:**\n\n${songsList}᲼᲼`)
                .setTitle(`Queue - Coming Next`)
                .setFooter({text: `Developed with ❤️ by elpideus.`}),
            components: components
        };
    }

}