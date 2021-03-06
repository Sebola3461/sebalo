import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, twitchUsers, users } from "../../../../database";

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
		return client.say(channel, "Streamer not found.").catch((e) => {
			console.log(e);
		});

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

	if (db_channel.requests.blacklist.includes(user))
		return client
			.say(
				channel,
				`@${tags["display-name"]}: This user is already blacklisted!`
			)
			.catch((e) => {
				console.log(e);
			});

	db_channel.requests.blacklist.push(user);

	await users.findByIdAndUpdate(db_channel._id, db_channel);

	const blacklisted_user = await twitchUsers.findOne({ username: user });

	if (blacklisted_user != null) {
		const level_index = blacklisted_user.levels.findIndex(
			(l: any) => l.channel == channel
		);

		blacklisted_user.levels.splice(level_index, 1);

		await twitchChannels.findOneAndUpdate(
			{
				username: channel.slice(1),
			},
			db_channel
		);
	}

	return client
		.say(
			channel,
			`@${tags["display-name"]}: Done! User added to blacklist. Requests and levels from this user will be deleted.`
		)
		.catch((e) => {
			console.log(e);
		});
};
