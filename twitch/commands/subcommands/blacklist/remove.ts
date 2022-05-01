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

	if (!db_channel) return client.say(channel, "Streamer not found.");

	if (!args[1])
		return client
			.say(channel, `@${tags["display-name"]}: Provide a valid user!`)
			.catch((e) => {
				console.log(e);
			});

	const user = args[1].toLowerCase().trim().replace(/@/g, "");

	if (user == "")
		return client
			.say(channel, `@${tags["display-name"]}: Provide a valid user!`)
			.catch((e) => {
				console.log(e);
			});

	if (!db_channel.requests.blacklist.includes(user))
		return client
			.say(
				channel,
				`@${tags["display-name"]}: This user isn't blacklisted!`
			)
			.catch((e) => {
				console.log(e);
			});

	const index = db_channel.requests.blacklist.findIndex(
		(u: string) => u == user
	);

	db_channel.requests.blacklist.splice(index, 1);

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		db_channel
	);

	return client
		.say(
			channel,
			`@${tags["display-name"]}: Done! User removed from blacklist!`
		)
		.catch((e) => {
			console.log(e);
		});
};
