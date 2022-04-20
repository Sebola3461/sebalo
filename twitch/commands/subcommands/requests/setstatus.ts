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

	const valid_status = [
		"ranked",
		"wip",
		"graveyard",
		"pending",
		"loved",
		"qualified",
	];

	args.shift();

	if (args.length < 1)
		return client
			.say(channel, `@${tags["display-name"]}: Provide valid modes!`)
			.catch((e) => {
				console.log(e);
			});

	const new_status: string[] = [];

	args.forEach((status) => {
		if (valid_status.includes(status.toLowerCase())) {
			new_status.push(status.toLowerCase());
		}
	});

	if (new_status.length < 1)
		return client
			.say(
				channel,
				`@${tags["display-name"]}: Provide valid modes! You can use "ranked", "unranked", "wip", "graveyard","pending", "loved" and "qualified"`
			)
			.catch((e) => {
				console.log(e);
			});

	db_channel.twitch_options.status = new_status;

	await users.findByIdAndUpdate(db_channel._id, db_channel);

	return client
		.say(
			channel,
			`@${
				tags["display-name"]
			}: Request beatmap status changed to ${new_status.join(", ")}!`
		)
		.catch((e) => {
			console.log(e);
		});
};
