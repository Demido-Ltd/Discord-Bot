import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
    ApplicationCommandOptionType,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
    TextChannel
} from "discord.js";

/**
 * A command to clear messages in a Discord channel.
 * @extends Command
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Clear extends Command {
    /**
     * @constructor
     * Creates an instance of the Clear command.
     * @param {CustomClient} client - The custom client instance.
     */
    constructor(client: CustomClient) {
        super(client, {
            client: client,
            name: 'clear',
            description: 'Clears all the messages in this chat.',
            category: Category.Moderation,
            default_member_permissions: PermissionsBitField.Flags.ManageMessages,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "amount",
                    description: "Amount of messages to delete. (0 - 100)",
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
                {
                    name: "target",
                    description: "Delete messages from this user. (default: all)",
                    type: ApplicationCommandOptionType.User,
                    required: false
                },
                {
                    name: "channel",
                    description: "The channel to delete messages from. (default: current channel)",
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_type: [ChannelType.GuildText],
                },
                {
                    name: "silent",
                    description: "Don't send a message to the channel.",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                }
            ]
        });
    }

    /**
     * Executes the Clear command.
     * @param {ChatInputCommandInteraction} interaction - The interaction with the command.
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        const errorEmbed = new EmbedBuilder().setColor("Red");
        try {
            let amount = (interaction.options.getInteger("amount") || 100) as number;
            const channel = (interaction.options.getChannel("channel") || interaction.channel) as TextChannel;
            const target = interaction.options.getMember("target") as GuildMember;
            const silent = interaction.options.getBoolean("silent") || true;

            // Check if the amount of messages to delete is within the acceptable range.
            if (amount < 1 || amount > 100)
                return interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ | You can only delete between 1 and 100 messages at a time.")],
                    ephemeral: true
                });

            // Fetch messages from the channel.
            const messages = await channel.messages.fetch({limit: 100});
            // Filter messages by target user if specified.
            const filteredMessages = target ? messages.filter(message => message.author.id == target.id) : messages;

            let deletedMessagesAmount: number;
            // Bulk delete the filtered messages.
            deletedMessagesAmount = (await channel.bulkDelete(Array.from(filteredMessages.keys()).slice(0, amount), true)).size;
            // If there are no messages to be deleted, notify the user.
            if (deletedMessagesAmount < 1) return interaction.reply({
                embeds: [errorEmbed
                    .setDescription("❌ | There are no messages to delete in this channel!")
                ], ephemeral: true
            });
            // If silent is false, send a success message to the channel.
            if (!silent)
                await channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({name: "🧹 Messages Annihilator"})
                        .setDescription(`✅ | Successfully deleted \`${deletedMessagesAmount}\` messages!`)
                        .setTimestamp()
                        .setFooter({
                            text: `Messages from ${target ? target.user.tag : "everyone"}.`
                        })]
                });
            // Reply to the interaction with a success message.
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Green").setDescription(`✅ | Successfully deleted \`${deletedMessagesAmount}\` messages ${target ? `from ${target}` : ""} in ${channel}`)],
                ephemeral: true
            });
        } catch (error) {
            // If an error occurred during message deletion, notify the user.
            return interaction.reply({embeds: [errorEmbed.setDescription("❌ | An error occurred while trying to delete the messages.")], ephemeral: true});
        }
    }
}
