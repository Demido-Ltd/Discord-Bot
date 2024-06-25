import IEvent from "../interfaces/IEvent";
import CustomClient from "./CustomClient";
import {Events} from "discord.js";
import IEventOptions from "../interfaces/IEventOptions";

/**
 * Represents an event handler for Discord.js events.
 * @implements {IEvent}
 * @author Stefan Cucoranu <elpideus@gmail.com>
 * @version 1.0
 */
export default class Event implements IEvent {

    /**
     * The client instance.
     * @type {CustomClient}
     */
    client: CustomClient;

    /**
     * A brief description of the event.
     * @type {string}
     */
    description: string;

    /**
     * The name of the Discord.js event.
     * @type {Events}
     */
    name: Events;

    /**
     * Indicates if the event should only be executed once.
     * @type {boolean}
     */
    once: boolean;

    /**
     * @constructor
     * Creates an instance of {@link Event}.
     * @param {CustomClient} client The CustomClient instance.
     * @param {IEventOptions} options The options for configuring the event.
     */
    constructor(client: CustomClient, options: IEventOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    Execute(...args: any): void {};

}