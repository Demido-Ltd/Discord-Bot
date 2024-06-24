import {Interaction} from "discord.js";
import CustomClient from "../base/classes/CustomClient";

/**
 * Utility class providing various helper functions.
 * @author Stefan Cucoranu <elpideus@gmail.com>
 */
export default class NumbersManipulation {

    /**
     * Formats a number into a human-readable string with units (K, M, B, T).
     *
     * @param {number} num The number to format.
     * @param {number} [digits=1] The number of decimal places to include.
     * @returns {string} The formatted number with appropriate unit.
     */
    static formatNumber(num: number, digits: number = 1): string {
        const units = ["", "K", "M", "B", "T"];
        let unitIndex = 0;

        while (num >= 1000 && unitIndex < units.length - 1) {
            num /= 1000;
            unitIndex++;
        }

        return num.toFixed(digits) + units[unitIndex];
    }

    /**
     * Formats a duration given in seconds into a human-readable string (DD:HH:MM:SS).
     *
     * @param {number} seconds - The duration in seconds to format.
     * @returns {string} The formatted duration string.
     */
    static formatDuration(seconds: number): string {
        const days = Math.floor(seconds / (24 * 3600));
        seconds %= 24 * 3600;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const dayStr = days > 0 ? `${days.toString().padStart(2, "0")}:` : "";
        const hourStr = (hours > 0 || days > 0) ? `${hours.toString().padStart(2, "0")}:` : "";
        const minuteStr = (minutes > 0 || hours > 0 || days > 0) ? `${minutes.toString().padStart(2, "0")}:` : "";
        const secondStr = `${remainingSeconds.toString().padStart(2, "0")}`;

        return `${dayStr}${hourStr}${minuteStr}${secondStr}`.trim();
    }

    static numberToEmoji(number: number): string {
        const emojiMap = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
        if (number === 10) return "🔟";
        return number.toString().split('').map(digit => emojiMap[parseInt(digit)]).join('');
    }

}