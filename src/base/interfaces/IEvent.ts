import CustomClient from "../classes/CustomClient";
import {Events} from "discord.js";

/**
 * Represents an event in the Demido Discord bot.
 * @interface IEvent
 */
export default interface IEvent {

    /** The client instance for the bot.
     * @type {CustomClient}
     */
    client: CustomClient;

    /** The name of the event.
     * @type {Events}
     */
    name: Events;

    /** A brief description of the event.
     * @type {string}
     */
    description: string;

    /** Indicates whether the event should be triggered only once.
     * @type {boolean}
     */
    once: boolean;
}