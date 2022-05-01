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

	if (!db_channel) return client.say(channel, "User not found.");

	args.shift();

	if (args.length < 1)
		return client
			.say(channel, `@${tags["display-name"]}: Provide a valid message!`)
			.catch((e) => {
				console.log(e);
			});

	db_channel.requests.messages.confirmation = args.join(" ");

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		db_channel
	);

	return client
		.say(
			channel,
			`@${tags["display-name"]}: Request confirmation message changed!`
		)
		.catch((e) => {
			console.log(e);
		});
};
