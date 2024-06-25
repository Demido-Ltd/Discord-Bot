import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import {ButtonInteraction, Events} from "discord.js";
import EmbedMessagesArchive from "../../utilities/EmbedMessagesArchive";

/**
 * Event that gets triggered whenever a button gets clicked.
 * @extends Event
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class ButtonHandler extends Event {

    /**
     * @constructor
     * Initializes the {@link ButtonHandler} class.
     * @param {CustomClient} client The bot client
     */
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Handles button interactions.",
            once: false,
        });
    }

    /**
     * Executes the ButtonHandler event.
     * @param {ButtonInteraction} interaction - The interaction with the command.
     */
    async Execute(interaction: ButtonInteraction) {

        if (!interaction.isButton()) return;

        const module = interaction.customId;
        const hasParameter = module.includes("|");

        const buttonCode = (await import(`../../buttons/${hasParameter ? module.split("|")[0] : module}`).catch(error => {
            interaction.reply({embeds: [EmbedMessagesArchive.buttonNoCodeWrongID(this.client)], ephemeral: true});
            // Send warning to the developers
            this.client.config.developerUsers.forEach(developer => this.client.users.fetch(developer).then(user =>
                user.send({embeds: [EmbedMessagesArchive.buttonNoCodeWrongID(this.client, interaction, true)]})))
        }))?.default;
        const parameters = hasParameter ? module.split("|").slice(1) : [];
        if (buttonCode) await buttonCode(this.client, interaction, parameters);

    }
}