import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { users } from "../../../../database";

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

	if (!db_channel) return client.say(channel, "User not found.");

	const value = Number(args[1]);

	if (isNaN(value))
		return client.say(
			channel,
			`@${tags["display-name"]}: Provide a valid number!`
		);

	db_channel.twitch_options.sr.min_sr = value;

	await users.findByIdAndUpdate(db_channel._id, db_channel);

	return client.say(
		channel,
		`@${tags["display-name"]}: Done! Only requests with more than ${value} stars will be sent.`
	);
};
