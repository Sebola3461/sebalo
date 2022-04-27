import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchUsers, users } from "../../../../database";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	const db_channel = (await users.find()).filter(
		(u) => u.twitch.channel == channel.slice(1)
	)[0];

	if (!db_channel)
		return client.say(channel, "Streamer not found.").catch((e) => {
			console.log(e);
		});

	if (db_channel.twitch_options.levels_enable == true)
		return client
			.say(
				channel,
				`@${tags["display-name"]}: Levels are already enabled!`
			)
			.catch((e) => {
				console.log(e);
			});

	db_channel.twitch_options.levels_enable = true;

	return client
		.say(channel, `@${tags["display-name"]}: Done! Levels enabled here!.`)
		.catch((e) => {
			console.log(e);
		});
};
