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

	if (!db_channel)
		return client.say(channel, "User not found.").catch((e) => {
			console.log(e);
		});

	args.shift();

	if (args.length < 1)
		return client
			.say(channel, `@${tags["display-name"]}: Provide a valid message!`)
			.catch((e) => {
				console.log(e);
			});

	db_channel.twitch_options.messages.bad_sr = args.join(" ");

	await users.findByIdAndUpdate(db_channel._id, db_channel);

	return client
		.say(
			channel,
			`@${tags["display-name"]}: Request star rating error message changed!`
		)
		.catch((e) => {
			console.log(e);
		});
};
