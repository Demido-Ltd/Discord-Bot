const numberToEmoji: { [key: number]: string } = { 0: "0️⃣", 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣", 6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣", 10: "🔟" };

export default class Numbermoji {

    public static emojify = (number: number) => {
        if (number === 10) return numberToEmoji[10];
        return number.toString().split('').map(digit => numberToEmoji[parseInt(digit)]).join('');
    }
}
