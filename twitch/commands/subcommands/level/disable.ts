import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, twitchUsers, users } from "../../../../database";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	const db_channel = await twitchChannels.findOne({
		username: channel.slice(1),
	});

	if (!db_channel)
		return client.say(channel, "Streamer not found.").catch((e) => {
			console.log(e);
		});

	if (db_channel.levels.enable == false)
		return client
			.say(
				channel,
				`@${tags["display-name"]}: Levels are already disabled!`
			)
			.catch((e) => {
				console.log(e);
			});

	db_channel.levels.enable = false;

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		db_channel
	);

	return client
		.say(
			channel,
			`@${tags["display-name"]}: Done! Levels are disabled here!`
		)
		.catch((e) => {
			console.log(e);
		});
};
