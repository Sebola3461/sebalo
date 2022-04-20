import tmi from "tmi.js";
import dotenv from "dotenv";
dotenv.config();
import getChannels from "./helpers/getChannels";
import { BanchoClient } from "bancho.js";
import parseTwitchRequest from "./helpers/parseTwitchRequest";
import commandHandler from "./helpers/commandHandler";
import updateLevels from "./helpers/updateLevels";
import checkUserDB from "./helpers/checkUserDB";
import updateLastMessageDate from "./helpers/updateLastMessageDate";

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

		setInterval(() => {
			try {
				updateLevels(client);
			} catch (e) {
				console.error(e);
			}
		}, 15000);

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

			checkUserDB(message, tags, channel, bancho, client);
			updateLastMessageDate(message, tags, channel, bancho, client);

			if (message.startsWith("!"))
				commandHandler(message, tags, channel, bancho, client);
		});
	} catch (e) {
		console.error(e);
	}
}
