import tmi from "tmi.js";
import dotenv from "dotenv";
dotenv.config();
import getChannels from "./helpers/getChannels";
import { BanchoClient } from "bancho.js";
import parseTwitchRequest from "./helpers/parseTwitchRequest";
import commandHandler from "./helpers/commandHandler";

export async function twitchClient(bancho: BanchoClient) {
	try {
		const channels = await getChannels();

		console.log(process.env.TWITCH_LOGIN);

		const client = new tmi.Client({
			identity: {
				username: process.env.TWITCH_LOGIN,
				password: `oauth:${process.env.TWITCH_OAUTH}`,
			},
			channels: channels,
		});

		setInterval(async () => {
			let all_channels = await getChannels();

			all_channels.forEach((channel) => {
				if (!client.getChannels().includes("#".concat(channel))) {
					client.join(channel);
				}
			});
		}, 5000);

		await client.connect();

		console.log("Twitch client running!");

		client.on("message", (channel, tags, message, self) => {
			if (
				message.includes("https://osu.ppy.sh/") &&
				!message.includes("/discussion")
			)
				return parseTwitchRequest(
					message,
					tags,
					channel,
					bancho,
					client
				);

			if (message.startsWith("!"))
				commandHandler(message, tags, channel, bancho, client);
		});
	} catch (e) {
		console.error(e);
	}
}
