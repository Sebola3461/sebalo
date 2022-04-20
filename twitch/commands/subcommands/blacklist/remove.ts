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

	if (!db_channel.twitch_options.blacklist.includes(user))
		return client
			.say(
				channel,
				`@${tags["display-name"]}: This user isn't blacklisted!`
			)
			.catch((e) => {
				console.log(e);
			});

	const index = db_channel.twitch_options.blacklist.findIndex(
		(u: string) => u == user
	);

	db_channel.twitch_options.blacklist.splice(index, 1);

	await users.findByIdAndUpdate(db_channel._id, db_channel);

	return client
		.say(
			channel,
			`@${tags["display-name"]}: Done! User removed from blacklist!`
		)
		.catch((e) => {
			console.log(e);
		});
};
