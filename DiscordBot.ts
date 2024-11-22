import "dotenv/config";
import {Client, GatewayIntentBits, type ClientOptions, Message} from "discord.js";
import chalk from "chalk";
import CommandsHandler from "./handlers/CommandsHandler.ts";
import DisTube, {type DisTubeOptions} from "distube";
import {YtDlpPlugin} from "@distube/yt-dlp";
import {YouTubePlugin} from "@distube/youtube";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";
import AppleMusicPlugin from "distube-apple-music";
import EventsHandler from "./handlers/EventsHandler.ts";
import ButtonsHandler from "./handlers/ButtonsHandler.ts";

export class Demido extends Client {
    commands: Map<string, any>;
    buttons: Map<string, any>;
    distube: DisTube | null;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Map<string, any>();
        this.buttons = new Map<string, any>();
        this.distube = null;
    }
}

export class CustomDisTube extends DisTube {
    nowPlayingMessages: Map<string, Message>;  // Define the type according to your needs

    constructor(client: Client<boolean>, options: DisTubeOptions | undefined) {
        super(client, options);
        this.nowPlayingMessages = new Map<string, Message>();
    }
}

export class DiscordBot {
    static client: Demido | null = null;

    static run = async () => {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ]
        }) as Demido;

        if (process.env.MUSIC) {
            client.distube = new DisTube(client, {
                plugins: [
                    new YouTubePlugin({
                        cookies: [
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385424,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "__Secure-1PAPISID",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "EAtecEzyEb8FZir3/AyDbgRhwz1LdgT0Se",
                                "id": 1
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385359,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "__Secure-1PSID",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "g.a000qAjYvHFIKGJZKTZMUZqru-uuos6FrH1rHooBGp7Q4hV2ItJw8wgxkZNe7Qk5kYmL-Bvr_wACgYKATASARESFQHGX2MiajfHnYphq7GT35o9snaAHhoVAUF8yKq0FTAEyaMnz1gm3fAtJfqY0076",
                                "id": 2
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606975.757801,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "__Secure-1PSIDCC",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "AKEyXzUmp2RUNMeSF40Ye-ufZibmR4XCg7nn--lVeWhVmu_HRJX9coWLMAi_WBEs00M4NXjJJA",
                                "id": 3
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385331,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "__Secure-1PSIDTS",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "sidts-CjIBQT4rXyP3dozExbT-tTz1SUDqqrmNxNni-Zqc2Gdq2lnlKspkpflEF0F7Xlv-Ce3JhRAA",
                                "id": 4
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385434,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "__Secure-3PAPISID",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "EAtecEzyEb8FZir3/AyDbgRhwz1LdgT0Se",
                                "id": 5
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385371,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "__Secure-3PSID",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "g.a000qAjYvHFIKGJZKTZMUZqru-uuos6FrH1rHooBGp7Q4hV2ItJwEHy2JMA8XghlPSdt_nqMQAACgYKAf8SARESFQHGX2MiNAO_XkgqO371fCvNKvjebBoVAUF8yKqft7DbzcxrdsaPeP4A1KYQ0076",
                                "id": 6
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606975.757823,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "__Secure-3PSIDCC",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "AKEyXzWBoJjKZ6VmHuULoJ5sTSghA9NXWVUda8ic-LVTk-hRUPDIQMrvu4nZ7LqQFIXXhEV4",
                                "id": 7
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385346,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "__Secure-3PSIDTS",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "sidts-CjIBQT4rXyP3dozExbT-tTz1SUDqqrmNxNni-Zqc2Gdq2lnlKspkpflEF0F7Xlv-Ce3JhRAA",
                                "id": 8
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385402,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "APISID",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "un3jqW6FmNot2dFC/AA8uDoMF-xkMarzFB",
                                "id": 9
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1731056728.959612,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "GPS",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "1",
                                "id": 10
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385382,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "HSID",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "AvfvE7vuoeMdjKiTd",
                                "id": 11
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606962.528982,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "LOGIN_INFO",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "AFmmF2swRQIgeaTv7slM-QI8GyUlUBzHJn6ph2SMLe7sEWhe6-8yJ7ACIQCPPUooEB9ctkfyc41nguVzgXdpCKa7mmJX2b1tAxPqLA:QUQ3MjNmeWd5YnFITU00RkJHZldzMEZ1N3N1N21NdFdKdmdjV3ppbGplcnJEMjBVUFpBQlREdFRMRlJXTGxSMDN0UHA5RDJxVDJEWkpmWHRuc2FkVjg5VFlobnM2aERUMXdFbmdERE1sUVQ2YTNxV1VFQVNUMkw5OUhheC1OSkZWSkh5b3A0TnB1UXZMWEF6TEJOQkMtMDJ6eDBwaXNNVm93",
                                "id": 12
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1731659775.145669,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "PREF",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "f6=40000000&tz=Europe.Rome",
                                "id": 13
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385413,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "SAPISID",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "EAtecEzyEb8FZir3/AyDbgRhwz1LdgT0Se",
                                "id": 14
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385281,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "SID",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "g.a000qAjYvHFIKGJZKTZMUZqru-uuos6FrH1rHooBGp7Q4hV2ItJwKlRujTPlV_ehWKcNagtzMAACgYKAU4SARESFQHGX2Mi-DvPVyBbr3-b8V278tkiyhoVAUF8yKr9y7ipMwnV2CeKUztUglvS0076",
                                "id": 15
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606975.75773,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "SIDCC",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "AKEyXzVVnDWNfwaiB-qgp20fiPiSChIZmLRaB_aO7WG7ylwUc-TlwfjKx9QLip_xJqhQPlw4yw",
                                "id": 16
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606928.878154,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "SOCS",
                                "path": "/",
                                "sameSite": "lax",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "CAISEwgDEgk2OTM5MDI3NDkaAmVuIAEaBgiAqbW5Bg",
                                "id": 17
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606956.385392,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "SSID",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "AZPVtlvdQi04hFY5w",
                                "id": 18
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1731054979,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "ST-tladcw",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "session_logininfo=AFmmF2swRQIgeaTv7slM-QI8GyUlUBzHJn6ph2SMLe7sEWhe6-8yJ7ACIQCPPUooEB9ctkfyc41nguVzgXdpCKa7mmJX2b1tAxPqLA%3AQUQ3MjNmeWd5YnFITU00RkJHZldzMEZ1N3N1N21NdFdKdmdjV3ppbGplcnJEMjBVUFpBQlREdFRMRlJXTGxSMDN0UHA5RDJxVDJEWkpmWHRuc2FkVjg5VFlobnM2aERUMXdFbmdERE1sUVQ2YTNxV1VFQVNUMkw5OUhheC1OSkZWSkh5b3A0TnB1UXZMWEF6TEJOQkMtMDJ6eDBwaXNNVm93",
                                "id": 19
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1731054980,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "ST-xuwub9",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "session_logininfo=AFmmF2swRQIgeaTv7slM-QI8GyUlUBzHJn6ph2SMLe7sEWhe6-8yJ7ACIQCPPUooEB9ctkfyc41nguVzgXdpCKa7mmJX2b1tAxPqLA%3AQUQ3MjNmeWd5YnFITU00RkJHZldzMEZ1N3N1N21NdFdKdmdjV3ppbGplcnJEMjBVUFpBQlREdFRMRlJXTGxSMDN0UHA5RDJxVDJEWkpmWHRuc2FkVjg5VFlobnM2aERUMXdFbmdERE1sUVQ2YTNxV1VFQVNUMkw5OUhheC1OSkZWSkh5b3A0TnB1UXZMWEF6TEJOQkMtMDJ6eDBwaXNNVm93",
                                "id": 20
                            },
                            {
                                "domain": ".youtube.com",
                                "expirationDate": 1746606928.878243,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "VISITOR_INFO1_LIVE",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                // @ts-ignore
                                "session": false,
                                "storeId": "0",
                                "value": "-I4i0ZmoxN8",
                                "id": 21
                            }
                        ]
                    }),
                    ...(process.env.SPOTIFY ? [new SpotifyPlugin({
                        api: {
                            clientId: process.env.SPOTIFY_CLIENT_ID,
                            clientSecret: process.env.SPOTIFY_SECRET,
                            topTracksCountry: process.env.SPOTIFY_COUNTRY
                        }
                    })] : []),
                    ...(process.env.SOUNDCLOUD ? [new SoundCloudPlugin()] : []),
                    ...(process.env.APPLE_MUSIC ? [new AppleMusicPlugin()] : []),
                    new YtDlpPlugin({update: false})
                ]
            });
            (client.distube as CustomDisTube).nowPlayingMessages = new Map<string, Message>;
        }

        client.once("ready", async () => {
            new CommandsHandler(this.client!);
            new ButtonsHandler(this.client!)
            new EventsHandler(this.client!);
        });

        return client.login(process.env.DISCORD_BOT_TOKEN).then(async () => {
            console.log(`${client!.user!.displayName} ready and at your service!`);
            this.client = client
            this.client.commands = new Map<string, any>();
            this.client.buttons = new Map<string, any>();
            return this.client;
        });
    }

    static async stop() {
        if (!this.client) return;

        try {
            console.log("Stopping Discord bot...");
            console.log(chalk.gray("(This may take a while)"));
            await this.client.destroy();
            const clearLines = (lines: number) => {
                for (let i = 0; i < lines; i++) {
                    process.stdout.moveCursor(0, -1);
                    process.stdout.clearLine(1);
                }
            };
            clearLines(2);
        } catch (error) {
            console.error("Error stopping Discord bot:", error);
        } finally {
            this.client = null;
        }
    }
}

// TODO: Add a button handler