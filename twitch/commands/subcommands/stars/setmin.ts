import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, users } from "../../../../database";

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
		return client.say(channel, "User not found.").catch((e) => {
			console.log(e);
		});

	const value = Number(args[1]);

	if (isNaN(value))
		return client
			.say(channel, `@${tags["display-name"]}: Provide a valid number!`)
			.catch((e) => {
				console.log(e);
			});

	db_channel.requests.sr.min_sr = value;

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		db_channel
	);

	return client
		.say(
			channel,
			`@${tags["display-name"]}: Done! Only requests with more than ${value} stars will be sent.`
		)
		.catch((e) => {
			console.log(e);
		});
};
