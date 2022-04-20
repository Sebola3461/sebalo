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
import getChannelUsers from "./helpers/getChannelUsers";
import quitChannel from "./helpers/quitChannel";

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

		await client
			.connect()
			.then(() => {
				console.log("Twitch client running!");

				try {
					setInterval(() => {
						try {
							updateLevels(client);
						} catch (e) {
							console.error(e);
						}
					}, 30000);

					setInterval(async () => {
						let all_channels = await getChannels();

						all_channels.forEach(async (channel) => {
							if (
								!client
									.getChannels()
									.includes("#".concat(channel))
							) {
								client.join(channel).catch((e) => {
									console.log(`err: ${e}`);

									if (e == "msg_banned")
										return quitChannel(channel, client);

									console.log(
										`Error on channel ${channel}: ${e}`
									);
								});
							}
						});
					}, 5000);
				} catch (e) {
					console.error(`Client error: ${e}`);
				}

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
					updateLastMessageDate(
						message,
						tags,
						channel,
						bancho,
						client
					);

					if (message.startsWith("!"))
						commandHandler(message, tags, channel, bancho, client);
				});
			})
			.catch((e) => {
				console.error(`Error during twitch client start: ${e}`);
			});
	} catch (e) {
		console.error(e);
	}
}
