import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { users } from "../../../../database";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client
) => {
	const db_channel = (await users.find()).filter(
		(u) => u.twitch.channel == channel.slice(1)
	)[0];

	if (!db_channel) return client.say(channel, "User not found.");

	if (db_channel.twitch_options.pause == true)
		return client
			.say(
				channel,
				`@${tags["display-name"]}: The requests are already paused, use !requests resume to resume.`
			)
			.catch((e) => {
				console.log(e);
			});

	db_channel.twitch_options.pause = true;

	await users.findByIdAndUpdate(db_channel._id, db_channel);

	return client
		.say(channel, `@${tags["display-name"]}: Requests paused!`)
		.catch((e) => {
			console.log(e);
		});
};
