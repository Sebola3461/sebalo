import tmi from "tmi.js";
import dotenv from "dotenv";
dotenv.config();
import getChannels from "./helpers/getChannels";
import { BanchoClient } from "bancho.js";
import parseTwitchRequest from "./helpers/parseTwitchRequest";

export async function twitchClient(bancho: BanchoClient) {
	const channels = await getChannels();

	console.log(process.env.TWITCH_LOGIN);

	const client = new tmi.Client({
		identity: {
			username: process.env.TWITCH_LOGIN,
			password: `oauth:${process.env.TWITCH_OAUTH}`,
		},
		channels: channels,
	});

	await client.connect();

	console.log("Twitch client running!");

	client.on("message", (channel, tags, message, self) => {
		if (message.includes("https://osu.ppy.sh/"))
			parseTwitchRequest(message, tags, channel, bancho, client);
	});
}
