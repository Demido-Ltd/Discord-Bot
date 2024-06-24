
/**
 * Utility class providing various helper functions.
 * @author Stefan Cucoranu <elpideus@gmail.com>
 */
export default class StringsManipulation {

    static limitStringLength(string: string, maxLength: number) {
        if (string.length > maxLength) return string.slice(0, maxLength - 3) + "...";
        return string
    }

}