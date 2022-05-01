import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, users } from "../../../../database";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client
) => {
	const db_channel = await twitchChannels.findOne({
		username: channel.slice(1),
	});

	if (!db_channel) return client.say(channel, "User not found.");

	if (db_channel.requests.pause == true)
		return client
			.say(
				channel,
				`@${tags["display-name"]}: The requests are already paused, use !requests resume to resume.`
			)
			.catch((e) => {
				console.log(e);
			});

	db_channel.requests.pause = true;

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		db_channel
	);

	return client
		.say(channel, `@${tags["display-name"]}: Requests paused!`)
		.catch((e) => {
			console.log(e);
		});
};
