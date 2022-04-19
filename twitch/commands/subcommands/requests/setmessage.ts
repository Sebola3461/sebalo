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

	args.shift();

	if (args.length < 1)
		return client.say(
			channel,
			`@${tags["display-name"]}: Provide a valid message!`
		);

	db_channel.twitch_options.messages.request = args.join(" ");

	await users.findByIdAndUpdate(db_channel._id, db_channel);

	return client.say(
		channel,
		`@${tags["display-name"]}: Request request message changed!`
	);
};
