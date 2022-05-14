import tmi from "tmi.js";
import dotenv from "dotenv";
dotenv.config();
import getChannels from "./helpers/channel/getChannels";
import { BanchoClient } from "bancho.js";
import parseTwitchRequest from "./helpers/messages/parseTwitchRequest";
import commandHandler from "./helpers/messages/commandHandler";
import { updateLevels } from "./helpers/levels/updateLevels";
import "./helpers/api/connect";
import quitChannel from "./helpers/channel/quitChannel";
import user from "../database/schemas/user";

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

		await client.connect().catch((e) => {
			console.error(`Error during twitch client start: ${e}`);
		});

		console.log("Twitch client running!");

		try {
			setInterval(async () => {
				let all_channels = await getChannels();

				all_channels.forEach(async (channel) => {
					if (!client.getChannels().includes("#".concat(channel))) {
						client.join(channel).catch((e) => {
							console.log(`err: ${e}`);

							if (e == "msg_banned")
								return quitChannel(channel, client);

							console.log(`Error on channel ${channel}: ${e}`);
						});
					}
				});
			}, 5000);
		} catch (e) {
			console.error(`Client error: ${e}`);
		}

		client.on("message", async (channel, tags, message, self) => {
			if (tags.username == process.env.TWITCH_LOGIN || self) return;

			if (
				message.includes("https://osu.ppy.sh/") &&
				message.includes("/b") &&
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

			await updateLevels(client, tags, channel, message);
		});
	} catch (e) {
		console.error(e);
	}
}
