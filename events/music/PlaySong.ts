export default {
    type: "playSong",
    execute: async (...args: any) => {
        await args[0].textChannel.send(`Started playing ${args[1].name}.`);
    }
}
