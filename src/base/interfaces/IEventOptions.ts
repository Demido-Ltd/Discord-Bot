import {Events} from "discord.js";

/**
 * Interface for event options.
 * @type {IEventOptions}
 */
export default interface IEventOptions {

    /** The name of the event.
     * @type {Events}
     */
    name: Events;

    /** A brief description of the event.
     * @type {string}
     */
    description: string;

    /** Indicates if the event should be triggered only once.
     * @type {boolean}
     */
    once: boolean;
}